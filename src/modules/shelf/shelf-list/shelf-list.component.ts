import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/modules/auth/auth.service';
import { User } from 'src/modules/auth/user.entity';
import { RestService } from 'src/services/rest/rest.service';
import { WorkflowDefinitionList } from '../../workflow/entities';

@Component({
	selector: 'app-shelf-list',
	templateUrl: './shelf-list.component.html',
	styleUrls: ['./shelf-list.component.scss'],
})
export class ShelfListComponent implements OnInit {
	constructor(readonly router: Router, private readonly rest: RestService, private readonly auth: AuthService) {}

	async ngOnInit() {
		this.workflows = await this.rest.new.navigate('workflows', WorkflowDefinitionList).getAll();
		this.currentUser = await this.auth.currentUser();
	}

	workflows: WorkflowDefinitionList[] = [];

	currentUser?: User;

	createNewWorkflow() {
		this.router.navigate(['shelf', 'new']);
	}
}
