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
		this.dialog
			.open(ShelfItemDetailsDialogComponent, {
				autoFocus: false,
				data: this.workflow,
			})
			.afterClosed()
			.subscribe(({ action }) => {
				switch (action) {
					case 'remove':
						if (!this.workflow.id) return; // TODO: ERROR
						this.rest.new
							.navigate('workflows')
							.delete(this.workflow.id)
							.then(() => this.remove.emit());
						break;
					case 'start':
						this.router.navigate(['/shelf', this.workflow.id, 'runs', 'new']);
						break;
					case 'logs':
						this.router.navigate(['/shelf', this.workflow.id, 'runs']);
						break;
					case 'edit':
						this.router.navigate(['/shelf', this.workflow.id]);
						break;
					default:
						return; // TODO: ERROR
				}
			});
	}

	bookmark() {
		return null; // TODO
	}
}
