import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowRunConfigureComponent } from './workflow-run-configure/workflow-run-configure.component';
import { WorkflowRunStatusComponent } from './workflow-run-status/workflow-run-status.component';
import { WorkflowEditComponent } from './workflow-edit/workflow-edit.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
	declarations: [WorkflowEditComponent, WorkflowRunConfigureComponent, WorkflowRunStatusComponent],
	imports: [
		CommonModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		MatStepperModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
	],
})
export class WorkflowModule {}
