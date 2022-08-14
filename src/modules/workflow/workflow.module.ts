import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowRunConfigureComponent } from './workflow-run-configure/workflow-run-configure.component';
import { WorkflowRunStatusComponent } from './workflow-run-status/workflow-run-status.component';
import { WorkflowEditComponent } from './workflow-edit/workflow-edit.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { RouterModule } from '@angular/router';
import { ParameterModule } from '../parameter/parameter.module';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
	declarations: [WorkflowEditComponent, WorkflowRunConfigureComponent, WorkflowRunStatusComponent],
	imports: [
		CommonModule,
		HttpClientModule,
		FormsModule,
		RouterModule,
		ReactiveFormsModule,
		ParameterModule,
		MatIconModule,
		MatCardModule,
		MatStepperModule,
		MatExpansionModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
	],
	providers: [
		{
			provide: STEPPER_GLOBAL_OPTIONS,
			useValue: { showError: true, displayDefaultIndicatorType: false },
		},
	],
})
export class WorkflowModule {}
