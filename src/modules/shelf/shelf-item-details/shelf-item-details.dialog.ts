import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AnyWorkflowDefinition, WorkflowDefinition, WorkflowDefinitionList } from 'src/modules/workflow/entities';
import { RestService } from 'src/services/rest/rest.service';

type DialogOptions = 'start' | 'logs' | 'remove' | 'edit';

@Component({
	selector: 'app-shelf-item-details-dialog',
	templateUrl: './shelf-item-details.dialog.html',
	styleUrls: ['./shelf-item-details.dialog.scss'],
})
export class ShelfItemDetailsDialogComponent implements OnInit {
	static defaultSubscriber(wfId: string, router: Router, rest: RestService, deleteEmitter?: EventEmitter<void>) {
		return (p: { action: DialogOptions }) => {
			switch (p.action) {
				case 'remove':
					rest.new
						.navigate('workflows')
						.delete(wfId)
						.then(() => deleteEmitter?.emit());
					break;
				case 'start':
					router.navigate(['/shelf', wfId, 'runs', 'new']);
					break;
				case 'logs':
					router.navigate(['/shelf', wfId, 'runs']);
					break;
				case 'edit':
					router.navigate(['/shelf', wfId]);
					break;
				default:
					return; // TODO: ERROR
			}
		};
	}
	public wf?: AnyWorkflowDefinition;

	constructor(
		public dialogRef: MatDialogRef<ShelfItemDetailsDialogComponent>,
		@Inject(MAT_DIALOG_DATA) private readonly data: WorkflowDefinitionList,
		private readonly rest: RestService,
		private readonly router: Router,
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

	action(action?: DialogOptions) {
		this.dialogRef.close({ action });
	}
}
