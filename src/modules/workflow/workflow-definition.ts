import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormGrouped } from 'src/util/formControllable';
import { User } from 'src/util/User.entity';
import { WorkflowLabel } from 'src/util/workflowLabels';
import { FormGroupedParameter, Parameter } from '../parameter/parameter';

export class WorkflowDefinitionList {
	id?: string;
	readonly kind: WorkflowLabel | null = null;
	name?: string;
	description?: string;
	icon?: string;
	owners?: User[] = [];
	hasParams?: boolean;

	iconStyle() {
		return this.icon ? `background-image: url('${this.icon}');background-size: cover;` : '';
	}
}
export class WorkflowDefinition extends WorkflowDefinitionList {
	parameterFields?: Parameter[] = [];

	formGroup() {
		return new WorkflowDefinitionFormGroup(this);
	}
}

export class WorkflowDefinitionFormGroup
	extends FormGroup
	implements FormGrouped<Pick<WorkflowDefinition, 'name' | 'description' | 'icon' | 'parameterFields'>>
{
	constructor(p?: Partial<WorkflowDefinition>) {
		super({
			name: new FormControl(p?.name, Validators.required),
			description: new FormControl(p?.description, Validators.required),
			icon: new FormControl(p?.icon),
			parameterFields: new FormArray(
				p?.parameterFields?.map(x => {
					return Parameter.factory(x.kind).accept(x).formGroup();
				}) || [],
			),
		});
	}

	get ctls() {
		return this.controls as {
			name: FormControl;
			description: FormControl;
			icon: FormControl;
			parameterFields: FormArray<FormGroupedParameter>;
		};
	}

	get iconStyle() {
		const v = this.ctls.icon.value;
		if (!v) return 'linear-gradient(45deg, #ccc, #eee)';
		return `url(${v})`;
	}
}
