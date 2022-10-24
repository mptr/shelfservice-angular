import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ShelfItemDetailsDialogComponent } from 'src/modules/shelf/shelf-item-details/shelf-item-details.dialog';
import { WorkflowDefinitionList } from 'src/modules/workflow/entities';
import { RestService } from 'src/services/rest/rest.service';
import { WorkflowRun } from '../workflow-run';

@Component({
	selector: 'app-workflow-log',
	templateUrl: './workflow-log.component.html',
	styleUrls: ['./workflow-log.component.scss'],
})
export class WorkflowLogComponent implements OnInit, AfterViewInit {
	displayedColumns: ['ranByName', 'ranByUsername', 'startedAt', 'status', 'actions'] = [
		'ranByName',
		'ranByUsername',
		'startedAt',
		'status',
		'actions',
	];
	dataSource: MatTableDataSource<{
		id?: string;
		ranByName?: string;
		ranByUsername?: string;
		startedAt?: Date;
		status?: string;
	}> = new MatTableDataSource();

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	wfId: string | null = null;

	wf?: WorkflowDefinitionList;

	constructor(
		private readonly route: ActivatedRoute,
		private readonly rest: RestService,
		private readonly dialog: MatDialog,
		private readonly router: Router,
	) {}

	private wfRest = this.rest.new.navigate('workflows', WorkflowDefinitionList);

	async ngOnInit() {
		this.wfId = this.route.snapshot.paramMap.get('id');
		if (!this.wfId) return;
		this.wf = await this.wfRest.getOne(this.wfId);
		this.refreshRuns();
		setTimeout(() => this.refreshRuns(), 3000);
	}

	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}

	async refreshRuns() {
		if (!this.wfId) return;
		const data = await this.wfRest.navigate(this.wfId).navigate('runs', WorkflowRun).getAll();
		this.dataSource.data = data.map(wf => ({
			id: wf.id,
			ranByName: wf.ranBy?.name,
			ranByUsername: wf.ranBy?.preferred_username,
			startedAt: wf.startedAt,
			status: wf.status,
		}));
	}

	openWfDetails() {
		if (!this.wf?.id) throw new Error('cannot render dialog for unknown workflow id');
		this.dialog
			.open(ShelfItemDetailsDialogComponent, { data: this.wf })
			.afterClosed()
			.subscribe(ShelfItemDetailsDialogComponent.defaultSubscriber(this.wf.id, this.router, this.rest));
	}

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();

		if (this.dataSource.paginator) {
			this.dataSource.paginator.firstPage();
		}
	}
}
