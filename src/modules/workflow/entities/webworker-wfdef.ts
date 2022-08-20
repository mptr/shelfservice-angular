import { Accept } from 'src/util/Accept.decorator';
import { WorkflowDefinition, WorkflowType } from '.';

export class WebWorkerWorkflowDefinition extends WorkflowDefinition {
	static override readableType = 'WebWorker';

	@Accept()
	override kind = WorkflowType.WEBWORKER;
	@Accept()
	artifactUrl?: string;

	override formGroup() {
		return super.formGroup();
	}
}
