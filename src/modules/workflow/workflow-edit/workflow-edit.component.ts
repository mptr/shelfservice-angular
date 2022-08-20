import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { RestService } from 'src/services/rest/rest.service';
import { enumToString } from 'src/util/enumToString';
import { Parameter, ParameterType, SetParameterFormControl } from '../../parameter/entities';
import {
	KubernetesWorkflowDefinitionFormGroup,
	WorkflowDefinition,
	WorkflowDefinitionFormGroup,
	WorkflowType,
} from '../entities';
import { AddParameterDialogComponent } from '../../parameter/add-parameter/add-parameter.dialog';
import { WorkflowDefinitionHelpers } from '../workflow-definition.helpers';

@Component({
	selector: 'app-workflow-edit',
	templateUrl: './workflow-edit.component.html',
	styleUrls: ['./workflow-edit.component.scss'],
})
export class WorkflowEditComponent extends WorkflowDefinitionHelpers implements OnInit {
	editId: string | null = null;

	kindControl = new FormControl<WorkflowType | undefined>(undefined, Validators.required);

	wf: WorkflowDefinitionFormGroup = new KubernetesWorkflowDefinitionFormGroup();

	constructor(
		private readonly dialog: MatDialog,
		private readonly activatedRoute: ActivatedRoute,
		private readonly rest: RestService,
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
					this.wf = new WorkflowDefinitionFormGroup(fetched);
					this.kindControl.setValue(fetched.kind);
				});
		}
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
			.subscribe(kind => {
				if (!kind) return;
				this.wf.ctls.parameterFields.push(Parameter.factory({ kind }).formGroup());
			});
	}
}
