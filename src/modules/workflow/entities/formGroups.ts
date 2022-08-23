import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Parameter, FormGroupedParameter } from 'src/modules/parameter/entities';
import { FormGrouped } from 'src/util/formControllable';
import { KubernetesWorkflowDefinition, WebWorkerWorkflowDefinition, WorkflowDefinition, WorkflowType } from '.';

export class WorkflowDefinitionFormGroup
	extends FormGroup
	implements FormGrouped<Pick<WorkflowDefinition, 'name' | 'description' | 'icon' | 'parameterFields'>>
{
	private static get ctors() {
		return {
			[WorkflowType.WEBWORKER]: WebWorkerWorkflowDefinitionFormGroup,
			[WorkflowType.KUBERNETES]: KubernetesWorkflowDefinitionFormGroup,
		};
	}

	convert(to: WorkflowType) {
		return new WorkflowDefinitionFormGroup.ctors[to](this.value);
	}

	constructor(p?: Partial<WorkflowDefinition>) {
		super({
			name: new FormControl(p?.name, Validators.required),
			description: new FormControl(p?.description, Validators.required),
			icon: new FormControl(p?.icon),
			parameterFields: new FormArray(
				p?.parameterFields?.map(x => {
					return Parameter.factory(x).formGroup();
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

	pushCommand(v = '') {
		(this.controls['command'] as FormArray).push(new FormControl(v, Validators.required));
	}
}
export class WebWorkerWorkflowDefinitionFormGroup
	extends WorkflowDefinitionFormGroup
	implements
		FormGrouped<Pick<WebWorkerWorkflowDefinition, 'name' | 'description' | 'icon' | 'parameterFields' | 'artifactUrl'>>
{
	constructor(p?: Partial<WebWorkerWorkflowDefinition>) {
		super(p);
		this.addControl('artifactUrl', new FormControl(p?.artifactUrl, Validators.required));
	}

	override get ctls() {
		return this.controls as {
			name: FormControl;
			description: FormControl;
			icon: FormControl;
			parameterFields: FormArray<FormGroupedParameter>;
			artifactUrl: FormControl;
		};
	}
}
