import { Accept } from 'src/util/Accept.decorator';
import { WorkflowDefinition, WorkflowType } from '.';
import { KubernetesWorkflowDefinitionFormGroup } from '.';

export class KubernetesWorkflowDefinition extends WorkflowDefinition {
	static override readableType = 'Kubernetes';

	@Accept()
	override kind = WorkflowType.KUBERNETES;
	@Accept()
	image?: string;
	@Accept()
	command?: string[] = [];

	override formGroup() {
		return new KubernetesWorkflowDefinitionFormGroup(this);
	}
}
