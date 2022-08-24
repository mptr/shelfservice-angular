import { AfterViewInit, Directive, ElementRef, HostBinding } from '@angular/core';

@Directive({
	selector: '[appAutosize]',
})
export class AutosizeDirective implements AfterViewInit {
	@HostBinding('class.autoWidth')
	autoWidth = true;

	input?: HTMLInputElement;

	constructor(private readonly elementRef: ElementRef) {
		console.log(this.elementRef.nativeElement);
	}

	adjust() {
		if (!this.input) throw new Error('autoWidth form field has no input');
		this.input.size = this.input.value.length > 9 ? Math.floor(this.input.value.length * 1.1) : 10;
	}

	ngAfterViewInit(): void {
		this.elementRef.nativeElement.querySelector('.mat-form-field-infix').style.width = 'auto';
		this.input = this.elementRef.nativeElement.querySelector('input');
		if (!this.input) throw new Error('autoWidth form field has no input');
		this.input.oninput = () => this.adjust();
		this.adjust();
	}
}
