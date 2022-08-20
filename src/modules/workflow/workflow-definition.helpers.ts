import { KubernetesWorkflowDefinition, KubernetesWorkflowDefinitionFormGroup } from './entities';
import {
	WorkflowDefinition,
	WorkflowDefinitionFormGroup,
	WorkflowType,
	WebWorkerWorkflowDefinition,
	WebWorkerWorkflowDefinitionFormGroup,
} from './entities';

export abstract class WorkflowDefinitionHelpers {
	getReadableType(type: WorkflowType) {
		return WorkflowDefinition.ctor(type).readableType;
	}

	workflowTypes = Object.values(WorkflowType) as WorkflowType[];

	workflowType: typeof WorkflowType = WorkflowType;

	isKubernetesWfDef(p?: WorkflowDefinition): p is KubernetesWorkflowDefinition {
		return p instanceof KubernetesWorkflowDefinition;
	}
	isWebWorkerWfDef(p?: WorkflowDefinition): p is WebWorkerWorkflowDefinition {
		return p instanceof WebWorkerWorkflowDefinition;
	}

	isKubernetesFg(wf: WorkflowDefinitionFormGroup): wf is KubernetesWorkflowDefinitionFormGroup {
		return wf instanceof KubernetesWorkflowDefinitionFormGroup;
	}

	isWebWorkerFg(wf: WorkflowDefinitionFormGroup): wf is WebWorkerWorkflowDefinitionFormGroup {
		return wf instanceof WebWorkerWorkflowDefinitionFormGroup;
	}
}
