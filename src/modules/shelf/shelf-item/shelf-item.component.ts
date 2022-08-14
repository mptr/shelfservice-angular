import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WorkflowDefinitionList } from '../../workflow/workflow-definition';
import { ShelfItemDetailsDialogComponent } from '../shelf-item-details/shelf-item-details.dialog';

@Component({
	selector: 'app-shelf-item',
	templateUrl: './shelf-item.component.html',
	styleUrls: ['./shelf-item.component.scss'],
})
export class ShelfItemComponent {
	@Input()
	workflow!: WorkflowDefinitionList;

	constructor(private readonly dialog: MatDialog) {}

	get ownerNames() {
		return this.workflow.owners?.map(o => o.given_name?.substring(0, 1) + ' ' + o.family_name).join(', ');
	}

	details() {
		this.dialog
			.open(ShelfItemDetailsDialogComponent, {
				autoFocus: false,
				data: this.workflow,
			})
			.afterClosed()
			.subscribe(result => {
				// if (!result) return;
				console.log(result);
				// this.wf.ctls.parameterFields.push(Parameter.factory(result).formGroup());
			});
	}
}
