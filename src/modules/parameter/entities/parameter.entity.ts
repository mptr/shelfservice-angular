/* eslint-disable @typescript-eslint/ban-types */
import { AbstractControl, FormArray, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { plainToInstance } from 'class-transformer';
import { Accept } from 'src/util/Accept.decorator';
import { FormGroupedParameter, FormGroupedSelectParameter } from '.';

export enum ParameterType {
	STRING = 'string',
	SELECT = 'select',
	NUMBER = 'number',
	BOOLEAN = 'boolean',
	DATE = 'date',
}

export class Parameter {
	static iconName = 'variables';

	static factory<D extends Parameter>(d: Partial<D> & Pick<D, 'kind'>): Parameter {
		return plainToInstance(Parameter.ctor(d.kind), d, {
			exposeDefaultValues: true,
			excludeExtraneousValues: true,
		});
	}

	static get ctors() {
		return {
			[ParameterType.STRING]: StringParameter,
			[ParameterType.SELECT]: SelectParameter,
			[ParameterType.NUMBER]: NumberParameter,
			[ParameterType.BOOLEAN]: BooleanParameter,
			[ParameterType.DATE]: DateParameter,
		};
	}
	static ctor(kind: ParameterType) {
		return Parameter.ctors[kind];
	}

	@Accept()
	name = '';
	@Accept()
	displayName = '';
	@Accept()
	description = '';
	@Accept()
	kind!: ParameterType;
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
}

export class BooleanParameter extends Parameter {
	static override iconName = 'check_box';

	@Accept()
	override kind = ParameterType.BOOLEAN;
	override formGroup() {
		return new FormGroupedParameter<BooleanParameter>({ ...super.formGroup().controls }, this);
	}
}

export abstract class RequirableParameter extends Parameter {
	@Accept()
	required = false;
	@Accept()
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
	static override iconName = 'text_fields';

	@Accept()
	override kind = ParameterType.STRING;
	@Accept()
	exampleValue = '';
	@Accept()
	pattern?: string;
	@Accept()
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
	static override iconName = 'date_range';

	@Accept()
	override kind = ParameterType.DATE;
	override formGroup() {
		return new FormGroupedParameter<DateParameter>({ ...super.formGroup().controls }, this);
	}
}

export class NumberParameter extends RequirableParameter {
	static override iconName = 'dialpad';

	@Accept()
	override kind = ParameterType.NUMBER;
	@Accept()
	min?: number;
	@Accept()
	max?: number;
	@Accept()
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
	static override iconName = 'style';

	@Accept()
	override kind = ParameterType.SELECT;
	@Accept()
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
