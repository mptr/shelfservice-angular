import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { KubernetesWorkflowDefinition } from 'src/modules/workflow/k8s-workflow-definition';
import { WebWorkerWorkflowDefinition } from 'src/modules/workflow/webworker-workflow-definition';
import { WorkflowDefinition, WorkflowDefinitionList } from 'src/modules/workflow/workflow-definition';
import { RestService } from 'src/services/rest/rest.service';

@Component({
	selector: 'app-shelf-item-details-dialog',
	templateUrl: './shelf-item-details.dialog.html',
})
export class ShelfItemDetailsDialogComponent implements OnInit {
	public wf: WorkflowDefinitionList & Partial<WorkflowDefinition>;

	constructor(
		public dialogRef: MatDialogRef<ShelfItemDetailsDialogComponent>,
		@Inject(MAT_DIALOG_DATA) private readonly data: WorkflowDefinition,
		private readonly rest: RestService,
	) {
		this.wf = data;
	}

	ngOnInit(): void {
		if (!this.wf.id) return;
		const kubeNav = this.rest.new.navigate('workflows', KubernetesWorkflowDefinition);
		const wwNav = this.rest.new.navigate('workflows', WebWorkerWorkflowDefinition);
		const activeNav = this.wf.kind === 'kubernetes' ? kubeNav : wwNav;
		activeNav.getOne(this.wf.id).then(wf => {
			this.wf = wf;
		});
	}

	select(): void {
		this.dialogRef.close();
	}
	cancel() {
		this.dialogRef.close();
	}
}
