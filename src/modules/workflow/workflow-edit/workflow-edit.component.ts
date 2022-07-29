import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RestService } from 'src/services/rest/rest.service';
import { KubernetesWorkflowDefinition, WorkflowDefinition } from '../WorkflowDefinition';

@Component({
	selector: 'app-workflow-edit',
	templateUrl: './workflow-edit.component.html',
	styleUrls: ['./workflow-edit.component.scss'],
})
export class WorkflowEditComponent implements OnInit {
	editId?: string;

	fg = new FormGroup({
		id: new FormControl(''),
		kind: new FormControl<'kubernetes' | 'webworker' | undefined>(undefined, Validators.required),
		//meta
		name: new FormControl('', Validators.required),
		description: new FormControl('', Validators.required),
		icon: new FormControl(''),
		// param
		parameterFields: new FormArray<FormGroup>([
			new FormGroup({
				name: new FormControl('', Validators.required),
				kind: new FormControl<'string' | 'number' | 'boolean' | 'date' | null>(null),
			}),
		]),
	});

	fgSpecialized = new FormGroup({});

	constructor(private readonly activatedRoute: ActivatedRoute, private readonly rest: RestService) {}

	patchForm(wf: WorkflowDefinition) {
		this.fg.patchValue(wf);
		if (wf instanceof KubernetesWorkflowDefinition) this.fgSpecialized.patchValue(wf);
		// if (wf instanceof WebWorkerWorkflowDefinition) this.fgWebWorker.patchValue(wf);
	}

	ngOnInit(): void {
		this.editId = this.activatedRoute.snapshot.url[0].path;
		if (this.editId === 'new') this.patchForm(new WorkflowDefinition({}));
		else
			this.rest.new
				.navigate('workflows', WorkflowDefinition)
				.getOne(this.editId)
				.then(wf => {
					this.fg.patchValue(wf);
				});
	}

	save() {
		const wf = { ...this.fg.value, ...this.fgSpecialized.value };
		if (!wf.kind || !this.editId) return;

		const workflowsRest = this.rest.new.navigate<WorkflowDefinition[]>('workflows');
		if (this.editId !== 'new')
			workflowsRest
				.navigate<WorkflowDefinition>(this.editId)
				.patch(wf)
				.subscribe(x => this.patchForm(x));
		else
			workflowsRest
				.navigate<WorkflowDefinition[]>(wf.kind)
				.post(wf)
				.subscribe(x => this.patchForm(x));
	}
}
