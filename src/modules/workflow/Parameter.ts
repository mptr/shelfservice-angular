import { FormControl, FormGroup, Validators } from '@angular/forms';

export enum ParameterType {
	STRING = 'string',
	NUMBER = 'number',
	BOOLEAN = 'boolean',
	DATE = 'date',
}

export class Parameter {
	name!: string;
	kind!: ParameterType;

	get formGroup() {
		return new FormGroup({
			name: new FormControl(this.name, Validators.required),
			kind: new FormControl(this.kind, Validators.required),
		});
	}
}

export class SetParameter extends Parameter {
	value?: string;
}
