import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormControlable } from 'src/util/formControllable';
import { ParameterFormGroup } from './parameter';
import { WorkflowDefinitionFormGroup, WorkflowDefinition } from './workflow-definition';

export class WebWorkerWorkflowDefinitionFormGroup
	extends FormGroup<FormControlable<WebWorkerWorkflowDefinition>>
	implements WorkflowDefinitionFormGroup
{
	constructor(p?: Partial<WebWorkerWorkflowDefinition>) {
		super({
			name: new FormControl(p?.name, Validators.required),
			description: new FormControl(p?.description, Validators.required),
			icon: new FormControl(p?.icon),
			parameterFields: new FormArray(p?.parameterFields?.map(x => new ParameterFormGroup(x)) || []),
			artifactUrl: new FormControl(p?.artifactUrl, Validators.required),
		});
	}

	get iconStyle() {
		const v = this.controls['icon']?.value;
		if (!v) return 'linear-gradient(45deg, #ccc, #ddd)';
		return `url(${v})`;
	}

	pushParameterField() {
		const pfs = this.controls['parameterFields'];
		if (!pfs) throw new Error('missing arameterFields Form Group');
		pfs.push(new ParameterFormGroup({}));
	}
}
export class WebWorkerWorkflowDefinition extends WorkflowDefinition {
	override readonly kind = 'webworker';
	artifactUrl?: string;
}
