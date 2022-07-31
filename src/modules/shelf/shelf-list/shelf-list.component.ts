import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from 'src/services/rest/rest.service';
import { WorkflowDefinitionList } from '../../workflow/WorkflowDefinition';

@Component({
	selector: 'app-shelf-list',
	templateUrl: './shelf-list.component.html',
	styleUrls: ['./shelf-list.component.scss'],
})
export class ShelfListComponent implements OnInit {
	constructor(readonly router: Router, private readonly rest: RestService) {}

	ngOnInit(): void {
		this.rest.new
			.navigate('workflows', WorkflowDefinitionList)
			.getAll()
			.then(wfs => {
				console.log(wfs);
				this.workflows = wfs;
			});
	}

	workflows: WorkflowDefinitionList[] = [];

	createNewWorkflow() {
		this.router.navigate(['shelf', 'new']);
	}
}
