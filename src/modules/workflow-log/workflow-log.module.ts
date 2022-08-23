import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowRunStatusComponent } from './workflow-run-status/workflow-run-status.component';
import { WorkflowLogComponent } from './workflow-log/workflow-log.component';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { WorkflowModule } from '../workflow/workflow.module';
import { DateRelativePipe } from 'src/pipes/date-relative.pipe';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
	declarations: [WorkflowRunStatusComponent, WorkflowLogComponent, DateRelativePipe],
	imports: [
		CommonModule,
		RouterModule,
		MatCardModule,
		MatButtonModule,
		MatIconModule,
		MatTooltipModule,
		FormsModule,
		MatCheckboxModule,
		MatInputModule,
		WorkflowModule,
		MatTableModule,
		MatPaginatorModule,
		MatSortModule,
	],
})
export class WorkflowLogModule {}
