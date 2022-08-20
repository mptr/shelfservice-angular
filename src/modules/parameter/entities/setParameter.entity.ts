import { FormArray, FormControl } from '@angular/forms';
import { Accept } from 'src/util/Accept.decorator';
import { Parameter } from '.';

export class SetParameters extends FormArray<SetParameterFormControl> {
	get configObject() {
		return this.controls.reduce(
			(prev, cur) => ({
				...prev,
				[cur.parameter.name]: `${cur.value}`,
			}),
			{},
		);
	}
}

export class SetParameter {
	@Accept()
	displayName = '';
	@Accept()
	value = '';
	@Accept()
	description = '';
}

export class SetParameterFormControl extends FormControl {
	constructor(public parameter: Parameter, value = '') {
		super(value, parameter.validators());
	}
}
