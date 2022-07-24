import { Component, Input } from '@angular/core';
import { WorkflowDefinition } from '../../workflow/WorkflowDefinition';

@Component({
	selector: 'app-shelf-item',
	templateUrl: './shelf-item.component.html',
	styleUrls: ['./shelf-item.component.scss'],
})
export class ShelfItemComponent {
	@Input()
	workflow!: WorkflowDefinition;
}
