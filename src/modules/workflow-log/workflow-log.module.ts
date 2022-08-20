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
import { MatExpansionModule } from '@angular/material/expansion';
import { DateAgoPipe } from 'src/pipes/date-ago.pipe';

@NgModule({
	declarations: [WorkflowRunStatusComponent, WorkflowLogComponent, DateAgoPipe],
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
		MatExpansionModule,
	],
})
export class WorkflowLogModule {}
