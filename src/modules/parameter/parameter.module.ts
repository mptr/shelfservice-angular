import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParamEditComponent } from './param-edit/param-edit.component';
import { ParamInputComponent } from './param-input/param-input.component';
import { AddParameterDialogComponent } from './add-parameter/add-parameter.dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
	declarations: [ParamEditComponent, ParamInputComponent, AddParameterDialogComponent],
	imports: [
		CommonModule,
		MatIconModule,
		MatFormFieldModule,
		MatCheckboxModule,
		MatDialogModule,
		FormsModule,
		ReactiveFormsModule,
		MatSelectModule,
		MatButtonModule,
		MatTooltipModule,
		MatInputModule,
		MatChipsModule,
	],
	exports: [ParamEditComponent, ParamInputComponent],
})
export class ParameterModule {}
