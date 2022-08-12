import { FormArray, FormControl, FormGroup } from '@angular/forms';

type Array = readonly unknown[];

type ArrayElement<ArrayType extends Array> = ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type FormControlable<T> = {
	// eslint-disable-next-line @typescript-eslint/ban-types
	[P in keyof T as T[P] extends Function ? never : P]?: T[P] extends Array
		? FormArray<ArrayElement<T[P]> extends string | number ? FormControl : FormGroup>
		: FormControl;
};
