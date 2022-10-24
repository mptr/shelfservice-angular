import { Accept } from 'src/util/Accept.decorator';
import { User } from '../auth/user.entity';
import { SetVariable } from '../parameter/entities/setParameter.entity';
import { WorkflowDefinition, KubernetesWorkflowDefinition, WebWorkerWorkflowDefinition } from '../workflow/entities';

export class WorkflowRun {
	@Accept()
	id?: string;

	@Accept()
	variables: SetVariable[] = [];

	@Accept()
	startedAt?: Date;

	@Accept()
	finishedAt?: Date;

	@Accept(() => User)
	ranBy?: User;

	@Accept()
	status?: 'prepared' | 'success' | 'failure' | 'running';

	@Accept(() => WorkflowDefinition, {
		property: 'kind',
		subTypes: WorkflowDefinition.ctors,
	})
	workflowDefinition?: KubernetesWorkflowDefinition | WebWorkerWorkflowDefinition;

	get parametersSorted() {
		return (this.workflowDefinition?.parameterFields || []).sort((a, b) => a.displayName.localeCompare(b.displayName));
	}

	getValueFor(parameter: string) {
		return this.variables.find(v => v.name === parameter)?.value;
	}
}
