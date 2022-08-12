import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { ParameterFormGroup } from './parameter';
import { WorkflowDefinitionFormGroup, WorkflowDefinition } from './workflow-definition';

export class KubernetesWorkflowDefinitionFormGroup
	extends FormGroup<{
		name: FormControl;
		description: FormControl;
		icon: FormControl;
		parameterFields: FormArray<ParameterFormGroup>;
		image: FormControl;
		command: FormArray<FormControl>;
	}>
	implements WorkflowDefinitionFormGroup
{
	constructor(p?: Partial<KubernetesWorkflowDefinition>) {
		super({
			name: new FormControl(p?.name, Validators.required),
			description: new FormControl(p?.description, Validators.required),
			icon: new FormControl(p?.icon),
			parameterFields: new FormArray(p?.parameterFields?.map(x => new ParameterFormGroup(x)) || []),
			image: new FormControl(p?.image, Validators.required),
			command: new FormArray<FormControl>(p?.command?.map(x => new FormControl(x, Validators.required)) || []),
		});
	}

	get iconStyle() {
		const v = this.controls['icon'].value;
		if (!v) return 'linear-gradient(45deg, #ccc, #ddd)';
		return `url(${v})`;
	}

	pushParameterField() {
		this.controls['parameterFields'].push(new ParameterFormGroup({}));
	}

	pushCommand() {
		this.controls['command'].push(new FormControl('', Validators.required));
	}
}
export class KubernetesWorkflowDefinition extends WorkflowDefinition {
	override readonly kind = 'kubernetes';
	image?: string;
	command: string[] = [];
}
