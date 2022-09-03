import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { KubernetesWorkflowDefinition, WebWorkerWorkflowDefinition } from 'src/modules/workflow/entities';
import { Message } from 'src/services/message/Message';
import { MessageService } from 'src/services/message/message.service';
import { RestService } from 'src/services/rest/rest.service';
import { WorkflowWorkerService } from 'src/services/workflow-worker/workflow-worker.service';
import { WorkflowRun } from '../workflow-run';

@Component({
	selector: 'app-workflow-run-status',
	templateUrl: './workflow-run-status.component.html',
	styleUrls: ['./workflow-run-status.component.scss'],
})
export class WorkflowRunStatusComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild('console')
	private consoleWindow!: ElementRef;
	private consoleElement?: HTMLElement;

	constructor(
		private readonly route: ActivatedRoute,
		private readonly rest: RestService,
		private readonly changeDetector: ChangeDetectorRef,
		private readonly messageService: MessageService,
		private readonly webworkerService: WorkflowWorkerService,
	) {}

	ngAfterViewInit(): void {
		this.consoleElement = this.consoleWindow.nativeElement;
		if (!this.consoleElement) return;
		this.consoleElement.onscroll = () => {
			if (!this.isProgramaticScroll) this.stick = false;
			this.isProgramaticScroll = false;
		};
	}

	wfId: string | null = null;
	runId: string | null = null;
	run?: WorkflowRun;
	logs: string[] = [];
	logSubscription: Subscription | null = null;

	ngOnInit() {
		this.wfId = this.route.snapshot.paramMap.get('id');
		this.runId = this.route.snapshot.paramMap.get('runId');
		this.updateWfData().then(() => {
			this.initiateLogStream();
		});
	}

	ngOnDestroy(): void {
		if (this.logSubscription) this.logSubscription.unsubscribe();
	}

	isProgramaticScroll = false;
	stick = false;
	scroll(direction: 'up' | 'down', instant = false) {
		this.isProgramaticScroll = true;
		this.consoleElement?.scrollTo({
			behavior: instant ? 'auto' : 'smooth',
			left: this.consoleElement.scrollLeft,
			top: direction === 'up' ? 0 : this.consoleElement.scrollHeight,
		});
	}

	async updateWfData() {
		if (!this.runId || !this.wfId) {
			this.messageService.push(new Message('Fehler', 'Keine Run-ID für den geöffneten Workflow gefunden', 'error'));
			return;
		}
		this.run = await this.rest.new
			.navigate('workflows')
			.navigate(this.wfId)
			.navigate('runs', WorkflowRun)
			.getOne(this.runId)
			.then(r => {
				const tmp =
					r.workflowDefinition?.kind === 'webworker'
						? new WebWorkerWorkflowDefinition()
						: new KubernetesWorkflowDefinition();
				Object.assign(tmp, r.workflowDefinition);
				r.workflowDefinition = tmp;
				return r;
			});
	}

	async initiateLogStream() {
		const logSource = await this.getLogSource();
		this.logSubscription = logSource.subscribe({
			next: msg => {
				this.logs.push(msg);
				this.changeDetector.detectChanges();
				if (this.stick) this.scroll('down', true);
			},
			complete: async () => {
				await new Promise(r => setTimeout(r, 1000)); // sleep 1 second to let the worker finish
				if (this.run?.finishedAt) return; // do not refresh and show message if this workflow was not running in the first place
				this.messageService.push(
					new Message(
						'Workflow beendet',
						'Der Workflow ' + this.run?.workflowDefinition?.name + ' wurde beendet.',
						'info',
					),
				);
				this.updateWfData();
			},
		});
	}

	async getLogSource() {
		// check if ids are present
		if (!this.runId || !this.wfId || !this.run) {
			this.messageService.push(new Message('Fehler', 'Keine Run-ID für den geöffneten Workflow gefunden', 'error'));
			throw new Error("Can't get log source. ID missing");
		}
		// start the workflow here if the workflow should be started client side
		if (this.run.workflowDefinition instanceof WebWorkerWorkflowDefinition && !this.run.finishedAt)
			return this.webworkerService.logs(this.run);
		// otherwise return a stream from the server
		else
			return this.rest.new
				.navigate('workflows')
				.navigate(this.wfId)
				.navigate('runs', WorkflowRun)
				.navigate(this.runId)
				.navigate('log')
				.sse();
	}
}
