import { Component, Input } from '@angular/core';
import { SetParameterFormControl } from '../parameter';

@Component({
	selector: 'app-param-input',
	templateUrl: './param-input.component.html',
	styleUrls: ['./param-input.component.scss'],
})
export class ParamInputComponent {
	@Input()
	ctl?: SetParameterFormControl;
}
