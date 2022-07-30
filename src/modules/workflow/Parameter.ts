import { FormControl, FormGroup, Validators } from '@angular/forms';

export class Parameter {
	name!: string;
	kind!: 'string' | 'number' | 'boolean' | 'date';

	get formGroup() {
		return new FormGroup({
			name: new FormControl(this.name, Validators.required),
			kind: new FormControl(this.kind, Validators.required),
		});
	}
}

export class SetParameter extends Parameter {
	value?: string;
}
