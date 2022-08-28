import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/modules/auth/user.entity';
import { RestService } from 'src/services/rest/rest.service';
import { WorkflowDefinitionList } from '../../workflow/entities';

@Component({
	selector: 'app-shelf-list',
	templateUrl: './shelf-list.component.html',
	styleUrls: ['./shelf-list.component.scss'],
})
export class ShelfListComponent implements OnInit {
	constructor(readonly router: Router, private readonly rest: RestService) {}

	private workflowRest = this.rest.new.navigate('workflows', WorkflowDefinitionList);

	async ngOnInit() {
		this.currentUser = await this.rest.new.navigate('users', User).getOne('self');
		this.updateSearch('');
	}

	workflows: WorkflowDefinitionList[] = [];

	currentUser?: User;

	createNewWorkflow() {
		this.router.navigate(['shelf', 'new']);
	}

	async updateSearch(str: string) {
		this.workflows = await this.workflowRest.getAll({ search: str });
	}
}
