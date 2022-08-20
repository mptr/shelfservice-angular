import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AnyWorkflowDefinition, WorkflowDefinition, WorkflowDefinitionList } from 'src/modules/workflow/entities';
import { RestService } from 'src/services/rest/rest.service';

@Component({
	selector: 'app-shelf-item-details-dialog',
	templateUrl: './shelf-item-details.dialog.html',
	styleUrls: ['./shelf-item-details.dialog.scss'],
})
export class ShelfItemDetailsDialogComponent implements OnInit {
	public wf?: AnyWorkflowDefinition;

	constructor(
		public dialogRef: MatDialogRef<ShelfItemDetailsDialogComponent>,
		@Inject(MAT_DIALOG_DATA) private readonly data: WorkflowDefinitionList,
		private readonly rest: RestService,
	) {}

	ngOnInit(): void {
		if (!this.data.id) return;
		this.rest.new
			.navigate('workflows', WorkflowDefinition.ctor(this.data.kind))
			.getOne(this.data.id)
			.then(wf => {
				this.wf = wf;
			});
	}

	get owns() {
		return true; // TODO
	}

	action(action?: 'start' | 'logs' | 'remove' | 'edit') {
		this.dialogRef.close({ action });
	}
}
