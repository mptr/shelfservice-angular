import { Component, Input, ViewChild } from '@angular/core';
import { ENTER } from '@angular/cdk/keycodes';
import { FormGroupedParameter, ParamInstanceTestable } from '../parameter';

@Component({
	selector: 'app-param-edit',
	templateUrl: './param-edit.component.html',
	styleUrls: ['./param-edit.component.scss'],
})
export class ParamEditComponent extends ParamInstanceTestable {
	@ViewChild('optInput') optInput!: { nativeElement: HTMLInputElement };

	@Input()
	ctl!: FormGroupedParameter;

	regexHelp() {
		window.open('https://regex101.com', '_blank');
	}

	readonly separatorKeysCodes = [ENTER] as const;

	addOption(v: string) {
		if (!this.isSelectParameterFg(this.ctl)) throw new Error('can only add options to select parameters');
		if (v === '') return;
		this.ctl.addOption(v);
		this.optInput.nativeElement.value = '';
		this.optInput.nativeElement.focus();
	}
}
