/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/ban-types */
// import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { AbstractControl, FormGroup } from '@angular/forms';

// type Array = readonly unknown[];

// type ArrayElement<ArrayType extends Array> = ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

// export type FormControlable<T> = {
// 	[P in keyof T]: T[P] extends Array
// 		? FormArray<
// 				ArrayElement<T[P]> extends string | number
// 					? FormControl<null | ArrayElement<T[P]>>
// 					: FormGrouped<ArrayElement<T[P]>>
// 		  >
// 		: FormControl<null | T[P]>;
// };

// export type AttrsOnly<T> = {
// 	[P in keyof T as T[P] extends Function ? never : P]: T[P];
// };

// // export type FormGrouped<T> = FormGroup<FormControlable<AttrsOnly<T>>>;
// export type FormGrouped<T> = FormGroup<FormControlable<T>>;
export type FormControlable<T> = {
	[P in keyof T]: AbstractControl;
};
export class FormGrouped<T> extends FormGroup<FormControlable<T>> {}
