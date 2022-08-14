import { FormControl, FormArray, Validators } from '@angular/forms';
import { FormGrouped } from 'src/util/formControllable';
import { FormGroupedParameter } from '../parameter/parameter';
import { WorkflowDefinitionFormGroup, WorkflowDefinition } from './workflow-definition';

export class KubernetesWorkflowDefinition extends WorkflowDefinition {
	override readonly kind = 'kubernetes';
	image?: string;
	command?: string[] = [];

	override formGroup() {
		return new KubernetesWorkflowDefinitionFormGroup(this);
	}
}

export class KubernetesWorkflowDefinitionFormGroup
	extends WorkflowDefinitionFormGroup
	implements
		FormGrouped<
			Pick<KubernetesWorkflowDefinition, 'name' | 'description' | 'icon' | 'parameterFields' | 'command' | 'image'>
		>
{
	constructor(p?: Partial<KubernetesWorkflowDefinition>) {
		super(p);
		this.addControl('image', new FormControl(p?.image, Validators.required));
		this.addControl('command', new FormArray(p?.command?.map(x => new FormControl(x, Validators.required)) || []));
	}

	override get ctls() {
		return this.controls as {
			name: FormControl;
			description: FormControl;
			icon: FormControl;
			parameterFields: FormArray<FormGroupedParameter>;
			command: FormArray<FormControl>;
			image: FormControl;
		};
	}

	pushCommand() {
		(this.controls['command'] as FormArray).push(new FormControl('', Validators.required));
	}
}
