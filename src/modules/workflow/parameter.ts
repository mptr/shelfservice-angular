import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormControlable } from 'src/util/formControllable';

export enum ParameterType {
	STRING = 'string',
	NUMBER = 'number',
	BOOLEAN = 'boolean',
	DATE = 'date',
}

export class Parameter {
	constructor(p?: Partial<Parameter>) {
		Object.assign(this, p);
	}
	name?: string;
	exampleValue?: string;
	description?: string;
	hint?: string;
	displayName?: string;
	kind?: ParameterType;
	pattern?: string;
	required?: boolean;
}

export class ParameterFormGroup extends FormGroup<FormControlable<Parameter>> {
	constructor(p: Partial<Parameter>) {
		super({
			name: new FormControl(p.name, [
				Validators.required,
				Validators.pattern('^[A-z][A-z0-9]*$'),
				Validators.maxLength(20),
			]),
			kind: new FormControl(p.kind, Validators.required),
			displayName: new FormControl(p.displayName, Validators.required),
			description: new FormControl(p.description),
			exampleValue: new FormControl(p.exampleValue),
			hint: new FormControl(p.hint),
			pattern: new FormControl(p.pattern),
			required: new FormControl(p.required),
		});
	}
}

export class SetParameter extends Parameter {
	constructor(p: Parameter, value: string) {
		super(p);
		this.value = value;
	}
	value?: string;
}

export class SetParameterFormControl extends FormControl {
	constructor(public parameter: Parameter, value = '') {
		const vs = [];
		if (parameter.pattern) vs.push(Validators.pattern(parameter.pattern));
		if (parameter.required) vs.push(Validators.required);
		super(value, vs);
	}

	toSetParameter() {
		return new SetParameter(this.parameter, this.value);
	}
}
