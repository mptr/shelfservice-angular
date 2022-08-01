import { Component, Input } from '@angular/core';
import { WorkflowDefinitionList } from '../../workflow/WorkflowDefinition';

@Component({
	selector: 'app-shelf-item',
	templateUrl: './shelf-item.component.html',
	styleUrls: ['./shelf-item.component.scss'],
})
export class ShelfItemComponent {
	@Input()
	workflow!: WorkflowDefinitionList;

	get ownerNames() {
		return this.workflow.owners.map(o => o.given_name?.substring(0, 1) + ' ' + o.family_name).join(', ');
	}
}
