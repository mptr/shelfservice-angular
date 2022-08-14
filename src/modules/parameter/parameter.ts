/* eslint-disable @typescript-eslint/ban-types */
import { AbstractControl, FormArray, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { FormControlable, FormGrouped } from 'src/util/formControllable';

type AttrsOnly<T> = {
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

export enum ParameterType {
	STRING = 'string',
	SELECT = 'select',
	NUMBER = 'number',
	BOOLEAN = 'boolean',
	DATE = 'date',
}
export const parameterIcons = {
	[ParameterType.STRING]: 'text_fields',
	[ParameterType.SELECT]: 'style',
	[ParameterType.NUMBER]: 'dialpad',
	[ParameterType.BOOLEAN]: 'check_box',
	[ParameterType.DATE]: 'date_range',
};

export abstract class Parameter {
	name = '';
	displayName = '';
	description = '';
	abstract kind: ParameterType;
	validators(): ValidatorFn[] {
		return [];
	}
	formGroup() {
		return new FormGroupedParameter({
			name: new FormControl(this.name, [
				Validators.required,
				Validators.pattern('^[A-z][A-z0-9]*$'),
				Validators.maxLength(20),
			]),
			displayName: new FormControl(this.displayName, Validators.required),
			description: new FormControl(this.description),
		});
	}

	static factory(kind: ParameterType): Parameter {
		switch (kind) {
			case ParameterType.STRING:
				return new StringParameter();
			case ParameterType.SELECT:
				return new SelectParameter();
			case ParameterType.NUMBER:
				return new NumberParameter();
			case ParameterType.BOOLEAN:
				return new BooleanParameter();
			case ParameterType.DATE:
				return new DateParameter();
			default:
				throw new Error(`Unknown parameter type: ${kind}`);
		}
	}
	accept(p?: Parameter) {
		Object.assign(this, p);
		return this;
	}
}

export class BooleanParameter extends Parameter {
	override kind = ParameterType.BOOLEAN;
	override formGroup() {
		return new FormGroupedParameter<BooleanParameter>({ ...super.formGroup().controls }, this);
	}
}

export abstract class RequirableParameter extends Parameter {
	required = false;
	hint = '';
	override validators(): ValidatorFn[] {
		return super.validators().concat(this.required ? Validators.required : []);
	}
	override formGroup(): FormGroupedParameter<RequirableParameter> {
		return new FormGroupedParameter<RequirableParameter>({
			...super.formGroup().controls,
			required: new FormControl(this.required),
			hint: new FormControl(this.hint),
		});
	}
}

export class StringParameter extends RequirableParameter {
	override kind = ParameterType.STRING;
	exampleValue = '';
	pattern?: string;
	multiline = false;
	override validators(): ValidatorFn[] {
		return super.validators().concat(this.pattern ? Validators.pattern(this.pattern) : []);
	}
	override formGroup() {
		return new FormGroupedParameter<StringParameter>(
			{
				...super.formGroup().controls,
				exampleValue: new FormControl(this.exampleValue),
				pattern: new FormControl(this.pattern),
				multiline: new FormControl(this.multiline),
			},
			this,
		);
	}
}

export class DateParameter extends RequirableParameter {
	override kind = ParameterType.DATE;
	override formGroup() {
		return new FormGroupedParameter<DateParameter>({ ...super.formGroup().controls }, this);
	}
}

export class NumberParameter extends RequirableParameter {
	override kind = ParameterType.NUMBER;
	min?: number;
	max?: number;
	step?: number;
	override validators(): ValidatorFn[] {
		return super.validators().concat([
			Validators.min(this.min || Number.MIN_SAFE_INTEGER),
			Validators.max(this.max || Number.MAX_SAFE_INTEGER),
			(ctl: AbstractControl) => {
				if (!this.step) return null;
				if (ctl.value % this.step !== 0) {
					return { step: true };
				}
				return null;
			},
		]);
	}
	override formGroup() {
		return new FormGroupedParameter<NumberParameter>(
			{
				...super.formGroup().controls,
				min: new FormControl(this.min),
				max: new FormControl(this.max),
				step: new FormControl(this.step),
			},
			this,
		);
	}
}

export class SelectParameter extends RequirableParameter {
	override kind = ParameterType.SELECT;
	options: string[] = [];
	override validators(): ValidatorFn[] {
		return super
			.validators()
			.concat((ctl: AbstractControl) => (!ctl.value || this.options.includes(ctl.value) ? null : { option: true }));
	}
	override formGroup() {
		return new FormGroupedSelectParameter(
			{
				...super.formGroup().controls,
				options: new FormArray(this.options?.map(o => new FormControl(o)) ?? []),
			},
			this,
		);
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

export class SetParameterFormControl extends FormControl {
	constructor(public parameter: Parameter, value = '') {
		super(value, parameter.validators());
	}
}

export abstract class ParamInstanceTestable {
	isRequirableParameter(p?: Parameter): p is RequirableParameter {
		return p instanceof RequirableParameter;
	}
	isSelectParameter(p?: Parameter): p is SelectParameter {
		return p instanceof SelectParameter;
	}
	isNumberParameter(p?: Parameter): p is NumberParameter {
		return p instanceof NumberParameter;
	}
	isDateParameter(p?: Parameter): p is DateParameter {
		return p instanceof DateParameter;
	}
	isBooleanParameter(p?: Parameter): p is BooleanParameter {
		return p instanceof BooleanParameter;
	}
	isStringParameter(p?: Parameter): p is StringParameter {
		return p instanceof StringParameter;
	}
	isRequirableParameterFg(p?: FormGroupedParameter): p is FormGroupedParameter<RequirableParameter> {
		return this.isRequirableParameter(p?.parameter);
	}
	isSelectParameterFg(p?: FormGroupedParameter): p is FormGroupedSelectParameter {
		return this.isSelectParameter(p?.parameter);
	}
	isNumberParameterFg(p?: FormGroupedParameter): p is FormGroupedParameter<NumberParameter> {
		return this.isNumberParameter(p?.parameter);
	}
	isDateParameterFg(p?: FormGroupedParameter): p is FormGroupedParameter<DateParameter> {
		return this.isDateParameter(p?.parameter);
	}
	isBooleanParameterFg(p?: FormGroupedParameter): p is FormGroupedParameter<BooleanParameter> {
		return this.isBooleanParameter(p?.parameter);
	}
	isStringParameterFg(p?: FormGroupedParameter): p is FormGroupedParameter<StringParameter> {
		return this.isStringParameter(p?.parameter);
	}
}
