import { Component, Input } from '@angular/core';
import { ParameterHelpers } from '../parameter.helpers';
import { SetParameterFormControl } from '../entities/setParameter.entity';

@Component({
	selector: 'app-param-input',
	templateUrl: './param-input.component.html',
	styleUrls: ['./param-input.component.scss'],
})
export class ParamInputComponent extends ParameterHelpers {
	@Input()
	ctl?: SetParameterFormControl;

	get parameter() {
		return this.ctl?.parameter;
	}
}
