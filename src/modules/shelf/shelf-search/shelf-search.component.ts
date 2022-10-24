import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'app-shelf-search',
	templateUrl: './shelf-search.component.html',
	styleUrls: ['./shelf-search.component.scss'],
})
export class ShelfSearchComponent {
	@Input()
	value = '';

	@Input()
	realTime = false;

	@Output()
	valueChange = new EventEmitter<string>();

	search() {
		console.log('search');
		this.valueChange.emit(this.value);
	}
}
