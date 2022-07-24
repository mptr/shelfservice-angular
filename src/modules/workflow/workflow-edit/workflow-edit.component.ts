import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RestService } from 'src/services/rest/rest.service';
import { Parameter } from '../Parameter';
import { WorkflowDefinition } from '../WorkflowDefinition';

@Component({
	selector: 'app-workflow-edit',
	templateUrl: './workflow-edit.component.html',
	styleUrls: ['./workflow-edit.component.scss'],
})
export class WorkflowEditComponent implements OnInit {
	workflow?: WorkflowDefinition;

	fg = new FormGroup({
		kind: new FormControl<'kubernetes' | 'webworker' | null>(null),
		name: new FormControl('', Validators.required),
		description: new FormControl('', Validators.required),
		icon: new FormControl(''),
		parameterFields: new FormArray<FormGroup>([
			new FormGroup({
				name: new FormControl('', Validators.required),
				kind: new FormControl<'string' | 'number' | 'boolean' | 'date' | null>(null),
			}),
		]),
	});

	constructor(private readonly activatedRoute: ActivatedRoute, private readonly rest: RestService) {}

	ngOnInit(): void {
		const p = this.activatedRoute.snapshot.url[0].path;
		if (p === 'new') this.workflow = new WorkflowDefinition({});
		else
			this.rest.new
				.navigate<WorkflowDefinition[]>('workflows')
				.navigate<WorkflowDefinition>(p)
				.get()
				.subscribe(wf => {
					this.workflow = wf;
					this.fg.patchValue(wf);
				});
	}

	save() {
		if (!this.workflow) return;
		const workflowsRest = this.rest.new.navigate<WorkflowDefinition[]>('workflows');
		if (this.workflow.id)
			workflowsRest
				.navigate<WorkflowDefinition>(this.workflow.id)
				.patch(this.workflow)
				.subscribe(x => (this.workflow = x));
		else workflowsRest.post(this.workflow).subscribe(x => (this.workflow = x));
	}
}
