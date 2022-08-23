import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowRunConfigureComponent } from './workflow-run-configure/workflow-run-configure.component';
import { WorkflowEditComponent } from './workflow-edit/workflow-edit.component';
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
import { WorkflowDetailsComponent } from './workflow-details/workflow-details.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
	declarations: [WorkflowEditComponent, WorkflowRunConfigureComponent, WorkflowDetailsComponent],
	imports: [
		CommonModule,
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
		MatDividerModule,
		MatTooltipModule,
	],
	providers: [
		{
			provide: STEPPER_GLOBAL_OPTIONS,
			useValue: { showError: true, displayDefaultIndicatorType: false },
		},
	],
	exports: [WorkflowDetailsComponent],
})
export class WorkflowModule {}
