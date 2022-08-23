import { Component, OnInit } from '@angular/core';
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

@Component({
	selector: 'app-workflow-edit',
	templateUrl: './workflow-edit.component.html',
	styleUrls: ['./workflow-edit.component.scss'],
})
export class WorkflowEditComponent extends WorkflowDefinitionHelpers implements OnInit {
	editId: string | null = null;

	kindControl = new FormControl<WorkflowType | undefined>(undefined, Validators.required);

	wf: WorkflowDefinitionFormGroup = new WorkflowDefinitionFormGroup(new WorkflowDefinition());

	constructor(
		private readonly dialog: MatDialog,
		private readonly activatedRoute: ActivatedRoute,
		private readonly rest: RestService,
		private readonly messageService: MessageService,
		private readonly router: Router,
	) {
		super();
	}

	types = enumToString(ParameterType);

	ngOnInit() {
		this.editId = this.activatedRoute.snapshot.paramMap.get('id');
		this.kindControl.valueChanges.subscribe(x => this.switchWfType(x));
		if (this.editId !== null) {
			// there exists an id, so we need to load the workflow
			this.rest.new
				.navigate('workflows', WorkflowDefinition)
				.getOne(this.editId)
				.then(fetched => {
					this.loadWorkflow(fetched, fetched.kind);
				});
		}
	}

	loadWorkflow(data: any, kind: WorkflowType) {
		this.kindControl.setValue(kind);
		this.wf = new WorkflowDefinitionFormGroup().convert(kind);
		this.wf.patchValue(data);
		data.parameterFields.forEach((p: any) => {
			this.wf.ctls.parameterFields.push(Parameter.factory(p).formGroup());
		});
		data.command.forEach((c: any) => {
			if (this.isKubernetesFg(this.wf)) this.wf.pushCommand(c);
		});
	}

	private switchWfType(kind?: WorkflowType | null) {
		if (kind) this.wf = this.wf.convert(kind);
		this.setupCachePreviewControls();
	}
	private setupCachePreviewControls() {
		this.wf.ctls.parameterFields.valueChanges.subscribe(() => {
			this.previewControls =
				this.wf.ctls.parameterFields.controls.map(pf => {
					return new SetParameterFormControl(pf.toParameter());
				}) || [];
		});
	}

	save() {
		if (!this.kindControl.value) return;
		const v = this.wf.value;
		console.log(v);
		const rest = this.rest.new.navigate('workflows');
		rest
			.navigate(this.kindControl.value, WorkflowDefinition)
			.post(v)
			.then(r => {
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
			.open(AddParameterDialogComponent, {
				autoFocus: false,
			})
			.afterClosed()
			.subscribe(kind => {
				if (!kind) return;
				this.wf.ctls.parameterFields.push(Parameter.factory({ kind }).formGroup());
			});
	}

	async importJsonFileChange($event: Event) {
		const config = await this.loadFile($event, 'content');
		const obj = JSON.parse(config);
		this.loadWorkflow(obj, obj.kind);
	}

	exportJson() {
		const str = JSON.stringify({ ...this.wf.value, kind: this.kindControl.value });
		const blob = new Blob([str], { type: 'application/json' });
		const link = document.createElement('a');
		link.href = window.URL.createObjectURL(blob);
		link.download = (this.wf.value.name || 'workflow').replace(/[^A-z0-9-]/, '-') + '.json';
		link.click();
		link.remove();
	}
}
