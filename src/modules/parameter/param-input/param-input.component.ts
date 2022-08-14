import { Component, Input } from '@angular/core';
import { ParamInstanceTestable, SetParameterFormControl } from '../parameter';

@Component({
	selector: 'app-param-input',
	templateUrl: './param-input.component.html',
	styleUrls: ['./param-input.component.scss'],
})
export class ParamInputComponent extends ParamInstanceTestable {
	@Input()
	ctl?: SetParameterFormControl;

	get parameter() {
		return this.ctl?.parameter;
	}
}
