import { AfterContentChecked, Directive, ElementRef, HostBinding } from '@angular/core';

@Directive({
	selector: '[appAutosize]',
})
export class AutosizeDirective implements AfterContentChecked {
	@HostBinding('class.autoWidth')
	autoWidth = true;

	input?: HTMLInputElement;

	textarea?: HTMLTextAreaElement;

	constructor(private readonly elementRef: ElementRef) {}

	adjust() {
		if (this.input) this.input.size = this.input.value.length > 9 ? Math.floor(this.input.value.length * 1.1) : 10;
		if (this.textarea) {
			console.log('adjust', this.textarea.value.length, this.textarea.scrollHeight);
			this.textarea.style.height = '0';
			this.textarea.style.height = this.textarea.scrollHeight + 'px';
		}
	}

	ngAfterContentChecked(): void {
		this.input = this.elementRef.nativeElement.querySelector('input');
		if (this.input) {
			this.elementRef.nativeElement.querySelector('.mat-form-field-infix').style.width = 'auto';
			this.input.oninput = () => this.adjust();
		}
		this.textarea = this.elementRef.nativeElement.querySelector('textarea');
		if (this.textarea) {
			this.textarea.oninput = () => this.adjust();
			this.textarea.onchange = () => this.adjust();
		}
		this.adjust();
	}
}
