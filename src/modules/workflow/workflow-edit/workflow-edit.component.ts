import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { RestService } from 'src/services/rest/rest.service';
import { enumToString } from 'src/util/enumToString';
import { WorkflowLabel } from 'src/util/workflowLabels';
import { KubernetesWorkflowDefinitionFormGroup } from '../k8s-workflow-definition';
import { Parameter, ParameterType, SetParameterFormControl } from '../../parameter/parameter';
import { WebWorkerWorkflowDefinitionFormGroup } from '../webworker-workflow-definition';
import { WorkflowDefinition, WorkflowDefinitionFormGroup } from '../workflow-definition';
import { AddParameterDialogComponent } from '../../parameter/add-parameter/add-parameter.dialog';

@Component({
	selector: 'app-workflow-edit',
	templateUrl: './workflow-edit.component.html',
	styleUrls: ['./workflow-edit.component.scss'],
})
export class WorkflowEditComponent implements OnInit {
	editId?: string;

	kindControl = new FormControl<WorkflowLabel | undefined>(undefined, Validators.required);

	wf: WorkflowDefinitionFormGroup = new KubernetesWorkflowDefinitionFormGroup();

	constructor(
		private readonly dialog: MatDialog,
		private readonly activatedRoute: ActivatedRoute,
		private readonly rest: RestService,
	) {}

	types = enumToString(ParameterType);

	ngOnInit() {
		this.editId = this.activatedRoute.snapshot.url[0].path;
		this.kindControl.valueChanges.subscribe(x => this.switchWfType(x));
		if (this.editId !== 'new') {
			// there exists an id, so we need to load the workflow
			this.rest.new
				.navigate('workflows', WorkflowDefinition)
				.getOne(this.editId)
				.then(fetched => {
					this.kindControl.setValue(fetched.kind);
					this.wf = new WorkflowDefinitionFormGroup(fetched);
				});
		} else this.editId = undefined;
		this.setupCachePreviewControls();
	}

	private switchWfType(kind?: WorkflowLabel | null) {
		if (kind === 'kubernetes') this.wf = new KubernetesWorkflowDefinitionFormGroup(this.wf?.value);
		else if (kind === 'webworker') this.wf = new WebWorkerWorkflowDefinitionFormGroup(this.wf?.value);
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

	isKubernetes(wf: WorkflowDefinitionFormGroup): wf is KubernetesWorkflowDefinitionFormGroup {
		return wf instanceof KubernetesWorkflowDefinitionFormGroup;
	}

	isWebWorker(wf: WorkflowDefinitionFormGroup): wf is WebWorkerWorkflowDefinitionFormGroup {
		return wf instanceof WebWorkerWorkflowDefinitionFormGroup;
	}

	save() {
		if (!this.kindControl.value) return;
		const v = this.wf.value;
		console.log(v);
		const rest = this.rest.new.navigate('workflows');
		rest
			.navigate(this.kindControl.value, WorkflowDefinition)
			.post(v)
			.then(r => console.log('ok', r)) // TODO: msg service
			.catch(e => console.error('err', e));
	}

	loadImage($event: { target: (EventTarget & { files?: Blob[] }) | null }) {
		const fctl = this.wf.get('icon');
		if (!fctl) throw new Error('Icon Form Control not found');
		const fs = $event.target?.files;
		if (!fs) {
			fctl?.setValue('');
			return;
		}
		const reader = new FileReader();
		reader.onload = e => {
			fctl.setValue(e.target?.result?.toString() || '');
		};
		reader.readAsDataURL(fs[0]);
	}

	previewControls: SetParameterFormControl[] = [];

	addParam() {
		this.dialog
			.open(AddParameterDialogComponent, {
				autoFocus: false,
			})
			.afterClosed()
			.subscribe(result => {
				if (!result) return;
				this.wf.ctls.parameterFields.push(Parameter.factory(result).formGroup());
			});
	}
}
