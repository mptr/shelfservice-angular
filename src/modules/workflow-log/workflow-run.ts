import { Accept } from 'src/util/Accept.decorator';
import { User } from '../auth/user.entity';
import { SetParameter } from '../parameter/entities/setParameter.entity';
import { WorkflowDefinition, KubernetesWorkflowDefinition, WebWorkerWorkflowDefinition } from '../workflow/entities';

export class WorkflowRun {
	@Accept()
	id?: string;

	@Accept()
	parameters: SetParameter[] = [];

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
		return this.parameters.sort((a, b) => a.displayName.localeCompare(b.displayName));
	}
}
