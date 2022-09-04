import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShelfListComponent } from '../shelf/shelf-list/shelf-list.component';
import { WorkflowEditComponent } from '../workflow/workflow-edit/workflow-edit.component';
import { WorkflowRunConfigureComponent } from '../workflow/workflow-run-configure/workflow-run-configure.component';
import { WorkflowRunStatusComponent } from '../workflow-log/workflow-run-status/workflow-run-status.component';
import { WorkflowLogComponent } from '../workflow-log/workflow-log/workflow-log.component';
import { HowToComponent } from '../how-to/how-to/how-to.component';

const routes: Routes = [
	{
		path: 'shelf',
		children: [
			{ path: '', component: ShelfListComponent },
			{ path: 'new', component: WorkflowEditComponent },
			{
				path: ':id',
				children: [
					{ path: '', component: WorkflowEditComponent },
					{
						path: 'runs',
						children: [
							{ path: '', component: WorkflowLogComponent },
							{ path: 'new', component: WorkflowRunConfigureComponent },
							{ path: ':runId', component: WorkflowRunStatusComponent },
						],
					},
				],
			},
		],
	},
	{ path: 'howto', component: HowToComponent },
	{ path: '**', redirectTo: 'shelf' },
];
@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
