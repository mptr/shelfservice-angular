import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShelfListComponent } from '../shelf/shelf-list/shelf-list.component';
import { WorkflowEditComponent } from '../workflow/workflow-edit/workflow-edit.component';
import { WorkflowRunConfigureComponent } from '../workflow/workflow-run-configure/workflow-run-configure.component';
import { WorkflowRunStatusComponent } from '../workflow/workflow-run-status/workflow-run-status.component';

const routes: Routes = [
	{
		path: 'shelf',
		children: [
			{ path: '', component: ShelfListComponent },
			{ path: 'new', component: WorkflowEditComponent },
			{
				path: ':id',
				component: WorkflowRunConfigureComponent,
				children: [
					{
						path: 'runs',
						// component: WorkflowRunLogComponent, // TODO: Implement
						children: [{ path: ':id', component: WorkflowRunStatusComponent }],
					},
				],
			},
		],
	},
	{ path: '**', redirectTo: 'shelf' },
];
@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
