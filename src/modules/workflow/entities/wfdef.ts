import { User } from 'src/modules/auth/user.entity';
import { Parameter } from 'src/modules/parameter/entities';
import { Accept } from 'src/util/Accept.decorator';
import { KubernetesWorkflowDefinition, WebWorkerWorkflowDefinition, WorkflowDefinitionFormGroup } from '.';

export enum WorkflowType {
	KUBERNETES = 'kubernetes',
	WEBWORKER = 'webworker',
}

export type AnyWorkflowDefinition = KubernetesWorkflowDefinition | WebWorkerWorkflowDefinition;

export class WorkflowDefinitionList {
	@Accept()
	id?: string;
	@Accept()
	kind!: WorkflowType;
	@Accept()
	name?: string;
	@Accept()
	description?: string;
	@Accept()
	icon?: string;
	@Accept(() => User)
	owners?: User[] = [];
	@Accept()
	hasParams?: boolean;
	@Accept()
	createdAt?: Date;

	iconStyle() {
		return this.icon ? `background-image: url('${this.icon}');background-size: cover;background-position: center;` : '';
	}
}
export class WorkflowDefinition extends WorkflowDefinitionList {
	static readableType = 'Workflow';

	@Accept()
	override kind!: WorkflowType;

	static get ctors() {
		return {
			[WorkflowType.WEBWORKER]: WebWorkerWorkflowDefinition,
			[WorkflowType.KUBERNETES]: KubernetesWorkflowDefinition,
		};
	}
	static ctor(kind: WorkflowType) {
		return WorkflowDefinition.ctors[kind];
	}

	@Accept(() => Parameter, {
		property: 'kind',
		subTypes: Parameter.ctors,
	})
	parameterFields?: Parameter[] = [];

	formGroup() {
		return new WorkflowDefinitionFormGroup(this);
	}
}
