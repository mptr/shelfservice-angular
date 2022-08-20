import { FormArray, FormControl } from '@angular/forms';
import { FormControlable, FormGrouped } from 'src/util/formControllable';
import { Parameter, SelectParameter } from '.';

type AttrsOnly<T> = {
	// eslint-disable-next-line @typescript-eslint/ban-types
	[P in keyof T as T[P] extends Function ? never : P extends 'kind' ? never : P]: T[P];
};

export class FormGroupedParameter<T extends Parameter = Parameter> extends FormGrouped<AttrsOnly<T>> {
	constructor(ctls: FormControlable<AttrsOnly<T>>, public readonly parameter?: T) {
		super(ctls);
		this.setControl('kind', new FormControl(parameter?.kind));
	}
	toParameter(): T {
		if (!this.parameter) throw new Error('parameter is not set');
		const p = this.parameter;
		Object.assign(p, this.value);
		return p;
	}
}

export class FormGroupedSelectParameter extends FormGroupedParameter<SelectParameter> {
	get options(): FormArray {
		return this.controls.options as FormArray;
	}
	removeOptionAt(index: number) {
		this.options.removeAt(index);
	}
	addOption(v: string) {
		this.options.push(new FormControl(v));
	}
}
