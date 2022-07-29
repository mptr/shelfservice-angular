import { Parameter } from './Parameter';

export class WorkflowDefinitionList {
	id: string | null = null;
	kind: 'kubernetes' | 'webworker' | null = null;
	name: string | null = null;
	description: string | null = null;
	icon: string | null = null;
	owners: any[] = [];
	hasParams: boolean | null = null;

	iconStyle() {
		return this.icon ? `background-image: url('${this.icon}');background-size: cover;` : '';
	}
}

export class WorkflowDefinition extends WorkflowDefinitionList {
	constructor(values?: Partial<WorkflowDefinition>) {
		super();
		Object.assign(this, values);
	}
	parameterFields: Parameter[] = [];

	accept(p: Partial<WorkflowDefinition>) {
		Object.assign(this, p);
	}
}

export class KubernetesWorkflowDefinition extends WorkflowDefinition {
	constructor(values?: Partial<KubernetesWorkflowDefinition>) {
		super(values);
		Object.assign(this, values);
	}
	image!: string;
	command: string[] = [];

	override accept(p: Partial<KubernetesWorkflowDefinition>) {
		Object.assign(this, p);
		super.accept(p);
	}
}
