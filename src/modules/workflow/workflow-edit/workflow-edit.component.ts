import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestService } from 'src/services/rest/rest.service';
import { WorkflowDefinition } from '../WorkflowDefinition';

@Component({
	selector: 'app-workflow-edit',
	templateUrl: './workflow-edit.component.html',
	styleUrls: ['./workflow-edit.component.scss'],
})
export class WorkflowEditComponent implements OnInit {
	workflow?: WorkflowDefinition;

	constructor(private readonly activatedRoute: ActivatedRoute, private readonly rest: RestService) {}

	ngOnInit(): void {
		const p = this.activatedRoute.snapshot.url[0].path;
		if (p === 'new') {
			this.workflow = new WorkflowDefinition({});
		} else {
			this.rest.new
				.navigate<WorkflowDefinition[]>('workflows')
				.navigate<WorkflowDefinition>(p)
				.get()
				.subscribe(wf => (this.workflow = wf));
		}
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
