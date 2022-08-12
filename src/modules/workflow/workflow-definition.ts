import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormControlable } from 'src/util/formControllable';
import { User } from 'src/util/User.entity';
import { WorkflowLabel } from 'src/util/workflowLabels';
import { Parameter, ParameterFormGroup } from './parameter';

export class WorkflowDefinitionList {
	id?: string;
	readonly kind: WorkflowLabel | null = null;
	name?: string;
	description?: string;
	icon?: string;
	owners: User[] = [];
	hasParams?: boolean;

	iconStyle() {
		return this.icon ? `background-image: url('${this.icon}');background-size: cover;` : '';
	}
}
export class WorkflowDefinition extends WorkflowDefinitionList {
	parameterFields: Parameter[] = [];
}

export class WorkflowDefinitionFormGroup extends FormGroup<FormControlable<WorkflowDefinition>> {
	constructor(p?: Partial<WorkflowDefinition>) {
		super({
			name: new FormControl(p?.name, Validators.required),
			description: new FormControl(p?.description, Validators.required),
			icon: new FormControl(p?.icon),
			parameterFields: new FormArray(p?.parameterFields?.map(x => new ParameterFormGroup(x)) || []),
		});
	}

	get iconStyle() {
		const v = this.controls['icon']?.value;
		if (!v) return 'linear-gradient(45deg, #ccc, #eee)';
		return `url(${v})`;
	}

	pushParameterField() {
		(this.controls['parameterFields'] as FormArray).push(new ParameterFormGroup({}));
	}
}

export class WorkflowConfigurationFormArray extends FormArray<FormControl> {
	constructor(wfdef: Pick<WorkflowDefinition, 'parameterFields'>) {
		super(
			wfdef.parameterFields.map(param => {
				return new FormControl();
			}),
		);
	}
}
