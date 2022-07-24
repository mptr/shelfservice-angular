import { Parameter } from './Parameter';

export class WorkflowDefinitionList {
	id!: string;
	kind!: 'kubernetes' | 'webworker';
	name!: string;
	description!: string;
	icon?: string;
	owners!: any[];
	hasParams!: boolean;

	iconStyle() {
		return this.icon ? `background-image: url('${this.icon}');background-size: cover;` : '';
	}
}

export class WorkflowDefinition extends WorkflowDefinitionList {
	constructor(values: Partial<WorkflowDefinition>) {
		super();
		Object.assign(this, values);
	}
	parameterFields: Parameter[] = [];
}

export class KubernetesWorkflowDefinition extends WorkflowDefinition {
	constructor(values: Partial<KubernetesWorkflowDefinition>) {
		super(values);
		Object.assign(this, values);
	}
	image!: string;
	command: string[] = [];
}
