import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from 'src/services/rest/rest.service';
import { WorkflowDefinition } from '../../workflow/WorkflowDefinition';

@Component({
	selector: 'app-shelf-list',
	templateUrl: './shelf-list.component.html',
	styleUrls: ['./shelf-list.component.scss'],
})
export class ShelfListComponent implements OnInit {
	constructor(readonly router: Router, private readonly rest: RestService) {}

	ngOnInit(): void {
		this.rest.new
			.navigate<WorkflowDefinition[]>('workflows')
			.get()
			.subscribe(wf => {
				console.log(wf);
				// this.workflows = wf;
			});
	}

	workflows: WorkflowDefinition[] = [];

	createNewWorkflow() {
		this.router.navigate(['shelf', 'new']);
	}
}
