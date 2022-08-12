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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ParamInputComponent } from './param-input/param-input.component';
import { RouterModule } from '@angular/router';

@NgModule({
	declarations: [WorkflowEditComponent, WorkflowRunConfigureComponent, WorkflowRunStatusComponent, ParamInputComponent],
	imports: [
		CommonModule,
		HttpClientModule,
		FormsModule,
		RouterModule,
		ReactiveFormsModule,
		MatStepperModule,
		MatFormFieldModule,
		MatInputModule,
		MatCheckboxModule,
		MatButtonModule,
		MatIconModule,
		MatSelectModule,
		MatCardModule,
		MatExpansionModule,
	],
	providers: [
		{
			provide: STEPPER_GLOBAL_OPTIONS,
			useValue: { showError: true, displayDefaultIndicatorType: false },
		},
	],
})
export class WorkflowModule {}
