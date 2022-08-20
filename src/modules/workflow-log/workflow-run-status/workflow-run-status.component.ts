import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KubernetesWorkflowDefinition, WebWorkerWorkflowDefinition } from 'src/modules/workflow/entities';
import { RestService } from 'src/services/rest/rest.service';
import { WorkflowRun } from '../workflow-run';

@Component({
	selector: 'app-workflow-run-status',
	templateUrl: './workflow-run-status.component.html',
	styleUrls: ['./workflow-run-status.component.scss'],
})
export class WorkflowRunStatusComponent implements OnInit, AfterViewInit {
	@ViewChild('console')
	private consoleWindow!: ElementRef;
	private consoleElement?: HTMLElement;

	constructor(
		private readonly route: ActivatedRoute,
		private readonly rest: RestService,
		private readonly changeDetector: ChangeDetectorRef,
	) {}

	ngAfterViewInit(): void {
		this.consoleElement = this.consoleWindow.nativeElement;
		if (!this.consoleElement) return;
		this.consoleElement.onscroll = () => {
			console.log(this.isProgramaticScroll);
			if (!this.isProgramaticScroll) this.stick = false;
			this.isProgramaticScroll = false;
		};
	}

	run?: WorkflowRun;

	logs: string[] = [];

	ngOnInit() {
		return this.updateWfData();
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

	private updateInterval?: ReturnType<typeof setTimeout>;
	private updateRunSince() {
		if (!this.run?.startedAt) return;
		const delta = Math.floor((Date.now() - new Date(this.run.startedAt).getTime()) / 1000);
		const labels = ['d', 'h', 'm', 's'];
		const ds = [Math.floor(delta / 86400), Math.floor(delta / 3600), Math.floor(delta / 60), delta % 60];
		this.runSince = ds
			.reduce((acc, cur, i) => {
				if (cur === 0) return acc;
				return acc + cur + labels[i] + ' ';
			}, '')
			.trim();
	}

	async updateWfData() {
		const wfId = this.route.snapshot.paramMap.get('id');
		const runId = this.route.snapshot.paramMap.get('runId');
		if (!runId || !wfId) return; // TODO message service
		const rest = this.rest.new.navigate('workflows').navigate(wfId).navigate('runs', WorkflowRun);
		this.run = await rest.getOne(runId).then(r => {
			const tmp =
				r.workflowDefinition?.kind === 'webworker'
					? new WebWorkerWorkflowDefinition()
					: new KubernetesWorkflowDefinition();
			Object.assign(tmp, r.workflowDefinition);
			r.workflowDefinition = tmp;
			return r;
		});

		this.updateRunSince();
		clearInterval(this.updateInterval);
		this.updateInterval = setInterval(() => this.updateRunSince(), 1000);

		rest
			.navigate(runId)
			.navigate('log')
			.sse()
			.subscribe({
				next: msg => {
					this.logs.push(msg);
					this.changeDetector.detectChanges();
					if (this.stick) this.scroll('down', true);
				},
				error: err => console.error(err), // TODO message service
				complete: () => console.log('complete'), // TODO message service
			});
	}

	runSince = '';
}
