import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from 'src/services/rest/rest.service';
import { enumToString } from 'src/util/enumToString';
import { Parameter, ParameterType, SetParameterFormControl } from '../../parameter/entities';
import { WorkflowDefinition, WorkflowDefinitionFormGroup, WorkflowType } from '../entities';
import { AddParameterDialogComponent } from '../../parameter/add-parameter/add-parameter.dialog';
import { WorkflowDefinitionHelpers } from '../workflow-definition.helpers';
import { MessageService } from 'src/services/message/message.service';
import { Message } from 'src/services/message/Message';
import { Subject, Subscription } from 'rxjs';
import { MatStepper } from '@angular/material/stepper';

@Component({
	selector: 'app-workflow-edit',
	templateUrl: './workflow-edit.component.html',
	styleUrls: ['./workflow-edit.component.scss'],
})
export class WorkflowEditComponent extends WorkflowDefinitionHelpers implements OnInit, AfterViewInit {
	editId: string | null = null;

	kindControl = new FormControl<WorkflowType | undefined>(undefined, Validators.required);

	wf: WorkflowDefinitionFormGroup = new WorkflowDefinitionFormGroup(new WorkflowDefinition());

	protected initialState?: Record<string, unknown> & Record<'kind', WorkflowType>;

	@ViewChild('stepper', { static: false }) stepper!: MatStepper;
	private stepperPresent = new Subject<void>();

	constructor(
		private readonly dialog: MatDialog,
		private readonly activatedRoute: ActivatedRoute,
		private readonly rest: RestService,
		private readonly messageService: MessageService,
		private readonly router: Router,
	) {
		super();
		this.initialState = this.router.getCurrentNavigation()?.extras?.state?.['workflow'];
	}

	types = enumToString(ParameterType);

	ngOnInit() {
		this.editId = this.activatedRoute.snapshot.paramMap.get('id');
		this.kindControl.valueChanges.subscribe(x => this.switchWfType(x));
		if (this.editId !== null) {
			// there exists an id, so we need to load the workflow
			this.rest.new
				.navigate('workflows')
				.getOne(this.editId)
				.then(fetched => {
					console.log('setting ', fetched);
					this.loadWorkflow(fetched as unknown as Record<string, unknown>, fetched['kind'] || 'kubernetes');
				});
		}
		if (this.initialState?.kind) {
			this.loadWorkflow(this.initialState, this.initialState.kind);
			// advance the stepper as soon as present
			this.stepperPresent.subscribe(() => setTimeout(() => (this.stepper.selectedIndex = 1), 0));
		}
	}
	async ngAfterViewInit() {
		this.stepperPresent.next();
	}

	loadWorkflow(data: Record<string, unknown>, kind: WorkflowType) {
		this.kindControl.setValue(kind);
		this.wf = new WorkflowDefinitionFormGroup().convert(kind);
		this.wf.patchValue(data);
		if (data['parameterFields'] !== undefined) {
			if (!Array.isArray(data['parameterFields']))
				console.error('could not load parameterFields data', data['parameterFields']);
			else
				data['parameterFields'].forEach((p: Partial<Parameter> & Pick<Parameter, 'kind'>) => {
					this.wf.ctls.parameterFields.push(Parameter.factory(p).formGroup());
				});
		}
		if (data['command'] !== undefined) {
			if (!Array.isArray(data['command'])) console.error('could not load command data', data['command']);
			else
				data['command'].forEach((c: string) => {
					if (this.isKubernetesFg(this.wf)) this.wf.pushCommand(c);
				});
		}
		this.setupCachePreviewControls();
	}

	private switchWfType(kind?: WorkflowType | null) {
		if (kind) this.wf = this.wf.convert(kind);
		this.setupCachePreviewControls();
	}
	private paramChangeSub?: Subscription;
	private setupCachePreviewControls() {
		const remap = () => {
			this.previewControls =
				this.wf.ctls.parameterFields.controls.map(pf => {
					return new SetParameterFormControl(pf.toParameter());
				}) || [];
			console.log('previewControls', this.previewControls);
		};
		this.paramChangeSub?.unsubscribe();
		this.paramChangeSub = this.wf.ctls.parameterFields.valueChanges.subscribe(() => remap());
		remap();
	}

	get formValue() {
		return { ...this.wf.value, kind: this.kindControl.value };
	}

	save() {
		const rest = this.rest.new.navigate('workflows', WorkflowDefinition.ctor(this.formValue.kind));
		console.log(rest.url);
		const result = this.editId ? rest.patch({ ...this.formValue, id: this.editId }) : rest.post(this.formValue);
		result.then(r => {
			this.messageService.push(
				new Message('Gespeichert', `Workflow "${r.name}" wurde erfolgreich gespeichert.`, 'success'),
			);
			this.router.navigate(['/']);
		});
	}

	async loadImage($event: Event) {
		const fctl = this.wf.get('icon');
		if (!fctl) throw new Error('Icon Form Control not found');
		fctl.setValue(await this.loadFile($event, 'dataUrl'));
	}

	private async loadFile($event: { target: (EventTarget & { files?: Blob[] }) | null }, type: 'dataUrl' | 'content') {
		return new Promise<string>((resolve, reject) => {
			const fs = $event.target?.files;
			if (!fs) return reject('no file provided');
			const reader = new FileReader();
			reader.onload = e => {
				console.log(e);
				if (!e.target?.result) return reject('No load result provided');
				resolve(e.target.result.toString());
			};
			reader.onerror = reject;
			if (type === 'dataUrl') reader.readAsDataURL(fs[0]);
			else reader.readAsText(fs[0]);
		});
	}

	previewControls: SetParameterFormControl[] = [];

	addParam() {
		this.dialog
			.open(AddParameterDialogComponent, { autoFocus: false })
			.afterClosed()
			.subscribe(kind => {
				if (!kind) return;
				this.wf.ctls.parameterFields.push(Parameter.factory({ kind }).formGroup());
			});
	}

	async importJsonFileChange($event: Event) {
		const e = $event as Event & { target: { value: string } };
		const config = await this.loadFile(e, 'content');
		e.target.value = '';
		const obj = JSON.parse(config);
		console.log('');
		this.loadWorkflow(obj, obj.kind);
		if (JSON.stringify(this.formValue) !== JSON.stringify(obj))
			this.messageService.push(
				new Message('Warnung', 'Die importierte Konfiguration enthält nicht unterstützte Felder.', 'warning'),
			);
		else this.messageService.push(new Message('Import', 'Import erfolgreich', 'success'));
	}

	exportJson() {
		const str = JSON.stringify(this.formValue);
		const blob = new Blob([str], { type: 'application/json' });
		const link = document.createElement('a');
		link.href = window.URL.createObjectURL(blob);
		link.download = (this.wf.value.name || 'workflow').replace(/[^A-z0-9-]/, '-') + '.json';
		link.click();
		link.remove();
	}
}
