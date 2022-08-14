import { FormArray, FormControl, Validators } from '@angular/forms';
import { FormGrouped } from 'src/util/formControllable';
import { FormGroupedParameter } from '../parameter/parameter';
import { WorkflowDefinitionFormGroup, WorkflowDefinition } from './workflow-definition';

export class WebWorkerWorkflowDefinition extends WorkflowDefinition {
	override readonly kind = 'webworker';
	artifactUrl?: string;
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
