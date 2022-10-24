import { Component, Input, TemplateRef } from '@angular/core';
import { MatCardActions } from '@angular/material/card';
import { AnyWorkflowDefinition, WorkflowDefinition } from '../entities';
import { WorkflowDefinitionHelpers } from '../workflow-definition.helpers';

@Component({
	selector: 'app-workflow-details',
	templateUrl: './workflow-details.component.html',
	styleUrls: ['./workflow-details.component.scss'],
})
export class WorkflowDetailsComponent extends WorkflowDefinitionHelpers {
	@Input()
	public wf?: AnyWorkflowDefinition;

	@Input()
	actions: TemplateRef<MatCardActions> | null = null;

	get readableType() {
		if (!this.wf) return '';
		return WorkflowDefinition.ctor(this.wf.kind).readableType;
	}
}
