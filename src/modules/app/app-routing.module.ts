import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShelfListComponent } from '../shelf/shelf-list/shelf-list.component';
import { WorkflowEditComponent } from '../workflow/workflow-edit/workflow-edit.component';

const routes: Routes = [
	{
		path: 'shelf',
		children: [
			{
				path: '',
				component: ShelfListComponent,
			},
			{
				path: 'new',
				component: WorkflowEditComponent,
			},
			// {
			// 	path: ':id',
			// 	component: WorkflowEditComponent,
			// 	children: [{ path: 'start', component: WorkflowStartComponent }],
			// },
		],
	},
	{ path: '**', redirectTo: 'shelf' },
];
@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
