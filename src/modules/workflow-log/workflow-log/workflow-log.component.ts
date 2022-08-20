import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ShelfItemDetailsDialogComponent } from 'src/modules/shelf/shelf-item-details/shelf-item-details.dialog';
import { WorkflowDefinitionList } from 'src/modules/workflow/entities';
import { RestService } from 'src/services/rest/rest.service';
import { WorkflowRun } from '../workflow-run';

@Component({
	selector: 'app-workflow-log',
	templateUrl: './workflow-log.component.html',
	styleUrls: ['./workflow-log.component.scss'],
})
export class WorkflowLogComponent implements OnInit {
	wfId: string | null = null;

	runs: WorkflowRun[] = [];

	wf?: WorkflowDefinitionList;

	constructor(
		private readonly route: ActivatedRoute,
		private readonly rest: RestService,
		private readonly dialog: MatDialog,
	) {}

	async ngOnInit() {
		this.wfId = this.route.snapshot.paramMap.get('id');
		if (!this.wfId) return;

		const rest = this.rest.new.navigate('workflows', WorkflowDefinitionList);
		this.wf = await rest.getOne(this.wfId);
		this.runs = await rest.navigate(this.wfId).navigate('runs', WorkflowRun).getAll();
	}

	stripIco(x: any) {
		delete x['workflowDefinition']['icon'];
		return x;
	}

	openWfDetails() {
		this.dialog.open(ShelfItemDetailsDialogComponent, { data: this.wf });
	}
}
