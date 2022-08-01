import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/util/User.entity';
import { WorkflowLabel } from 'src/util/workflowLabels';
import { Parameter } from './Parameter';

export class WorkflowDefinitionList {
	id: string | null = null;
	kind: WorkflowLabel | null = null;
	name: string | null = null;
	description: string | null = null;
	icon: string | null = null;
	owners: User[] = [];
	hasParams: boolean | null = null;

	iconStyle() {
		return this.icon ? `background-image: url('${this.icon}');background-size: cover;` : '';
	}
}

export class WorkflowDefinition extends WorkflowDefinitionList {
	constructor(values?: Partial<WorkflowDefinition>) {
		super();
		Object.assign(this, values); // todo: pick by whitelist
		this.addControls({
			name: new FormControl(this.name, Validators.required),
			description: new FormControl(this.description),
			icon: new FormControl(this.icon),
			parameterFields: new FormArray([]),
		});
		this.kind = null;
	}
	parameterFields: Parameter[] = [];

	formGroup = new FormGroup({});

	get parameterFieldsForm(): FormArray<FormGroup> {
		return this.formGroup.get('parameterFields') as unknown as FormArray<
			FormGroup<{
				name: FormControl<string>;
				type: FormControl<string>;
			}>
		>;
	}
	addParameterFieldForm() {
		const p = new Parameter();
		this.parameterFields.push(p);
		this.parameterFieldsForm.push(p.formGroup);
	}

	accept(p: Partial<WorkflowDefinition>) {
		Object.assign(this, p);
		this.formGroup.patchValue(this);
	}

	protected addControls(p: { [x in keyof this]?: AbstractControl }) {
		Object.entries(p).forEach(([k, v]) => this.addControl(k as keyof WorkflowDefinition, v));
	}

	protected addControl(name: keyof this, control: AbstractControl) {
		const ctlName = name.toString(); // determine the name of the control
		control.valueChanges.subscribe(x => {
			this[name] = x; // map changes to the model
		});
		this.formGroup.addControl(ctlName, control); // add the control to the formgroup
	}
}

export class KubernetesWorkflowDefinition extends WorkflowDefinition {
	constructor(values?: Partial<KubernetesWorkflowDefinition>) {
		super(values);
		Object.assign(this, values); // todo: pick by whitelist
		this.addControls({
			image: new FormControl(this.image, Validators.required),
			command: new FormControl(this.command, Validators.required),
		});
		this.kind = 'kubernetes';
	}
	image!: string;
	command!: string;

	override accept(p: Partial<KubernetesWorkflowDefinition>) {
		super.accept(p);
		Object.assign(this, p);
		this.formGroup.patchValue(this);
	}
}

export class WebWorkerWorkflowDefinition extends WorkflowDefinition {
	constructor(values?: Partial<WebWorkerWorkflowDefinition>) {
		super(values);
		Object.assign(this, values);
		this.addControls({
			artifactUrl: new FormControl(this.artifactUrl, Validators.required),
		});
		this.kind = 'webworker';
	}
	artifactUrl!: string;

	override accept(p: Partial<KubernetesWorkflowDefinition>) {
		super.accept(p);
		Object.assign(this, p);
		this.formGroup.patchValue(this);
	}
}
