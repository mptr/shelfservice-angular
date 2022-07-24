import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowRunConfigureComponent } from './workflow-run-configure/workflow-run-configure.component';
import { WorkflowRunStatusComponent } from './workflow-run-status/workflow-run-status.component';
import { WorkflowEditComponent } from './workflow-edit/workflow-edit.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
	declarations: [WorkflowEditComponent, WorkflowRunConfigureComponent, WorkflowRunStatusComponent],
	imports: [CommonModule, HttpClientModule],
})
export class WorkflowModule {}
