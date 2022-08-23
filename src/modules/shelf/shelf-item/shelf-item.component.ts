import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { User } from 'src/modules/auth/user.entity';
import { RestService } from 'src/services/rest/rest.service';
import { WorkflowDefinitionList } from '../../workflow/entities';
import { ShelfItemDetailsDialogComponent } from '../shelf-item-details/shelf-item-details.dialog';

@Component({
	selector: 'app-shelf-item',
	templateUrl: './shelf-item.component.html',
	styleUrls: ['./shelf-item.component.scss'],
})
export class ShelfItemComponent {
	@Input()
	workflow!: WorkflowDefinitionList;

	@Input()
	currentUser!: User;

	@Output()
	remove = new EventEmitter();

	constructor(
		private readonly dialog: MatDialog,
		private readonly router: Router,
		private readonly rest: RestService,
	) {}

	get ownerNames() {
		return this.workflow.owners?.map(o => o.name).join(', ');
	}

	details() {
		if (!this.workflow.id) throw new Error('cannot render dialog for unknown workflow id');
		this.dialog
			.open(ShelfItemDetailsDialogComponent, {
				autoFocus: false,
				data: this.workflow,
			})
			.afterClosed()
			.subscribe(
				ShelfItemDetailsDialogComponent.defaultSubscriber(this.workflow.id, this.router, this.rest, this.remove),
			);
	}

	bookmark() {
		return null; // TODO
	}
}
