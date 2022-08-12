import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RestService } from 'src/services/rest/rest.service';
import { enumToString } from 'src/util/enumToString';
import { WorkflowLabel } from 'src/util/workflowLabels';
import { KubernetesWorkflowDefinitionFormGroup } from '../k8s-workflow-definition';
import { ParameterType, SetParameterFormControl } from '../parameter';
import { WebWorkerWorkflowDefinitionFormGroup } from '../webworker-workflow-definition';
import { WorkflowDefinition, WorkflowDefinitionFormGroup } from '../workflow-definition';

@Component({
	selector: 'app-workflow-edit',
	templateUrl: './workflow-edit.component.html',
	styleUrls: ['./workflow-edit.component.scss'],
})
export class WorkflowEditComponent implements OnInit {
	editId?: string;

	kindControl = new FormControl<WorkflowLabel | undefined>(undefined, Validators.required);

	wf?: WorkflowDefinitionFormGroup = new KubernetesWorkflowDefinitionFormGroup();

	constructor(private readonly activatedRoute: ActivatedRoute, private readonly rest: RestService) {}

	types = enumToString(ParameterType);

	ngOnInit() {
		this.editId = this.activatedRoute.snapshot.url[0].path;
		if (this.editId !== 'new') {
			// there exists an id, so we need to load the workflow
			this.rest.new
				.navigate('workflows', WorkflowDefinition)
				.getOne(this.editId)
				.then(fetched => {
					this.kindControl.setValue(fetched.kind);
					this.wf = new WorkflowDefinitionFormGroup(fetched);
					this.switchWfType(fetched.kind);
				});
		} else this.editId = undefined;
		this.kindControl.valueChanges.subscribe(x => this.switchWfType(x));
	}

	private switchWfType(kind?: WorkflowLabel | null) {
		if (kind === 'kubernetes') this.wf = new KubernetesWorkflowDefinitionFormGroup(this.wf?.value);
		else if (kind === 'webworker') this.wf = new WebWorkerWorkflowDefinitionFormGroup(this.wf?.value);
		else this.wf = undefined;
		this.wf?.controls.parameterFields?.valueChanges.subscribe(
			vs => (this.prevCtl = vs.map(v => new SetParameterFormControl(v))),
		);
	}

	isKubernetes(wf: WorkflowDefinitionFormGroup): wf is KubernetesWorkflowDefinitionFormGroup {
		return wf instanceof KubernetesWorkflowDefinitionFormGroup;
	}

	isWebWorker(wf: WorkflowDefinitionFormGroup): wf is WebWorkerWorkflowDefinitionFormGroup {
		return wf instanceof WebWorkerWorkflowDefinitionFormGroup;
	}

	save() {
		if (!this.wf || !this.kindControl.value) return;
		const v = this.wf.value;
		console.log(v);
		const rest = this.rest.new.navigate('workflows');
		rest
			.navigate(this.kindControl.value, WorkflowDefinition)
			.post(v)
			.then(r => console.log('ok', r)) // TODO: msg service
			.catch(e => console.error('err', e));
	}

	loadImage($event: Event) {
		if (!this.wf) throw new Error('no workflow form group loaded');
		const fctl = this.wf.get('icon');
		if (!fctl) throw new Error('Icon Form Control not found');
		if (!$event.target) {
			fctl?.setValue('');
			return;
		}
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore it is a file input
		const f = $event.target.files[0];
		const reader = new FileReader();
		reader.onload = e => {
			fctl.setValue(e.target?.result || '');
		};
		reader.readAsDataURL(f);
	}

	regexHelp() {
		window.open('https://regex101.com', '_blank');
	}

	get currentValue() {
		return this.wf?.value;
	}

	prevCtl: SetParameterFormControl[] = [];
	previewFormControl(i: number) {
		return this.prevCtl[i];
	}
}
