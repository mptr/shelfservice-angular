/* eslint-disable @typescript-eslint/ban-types */
import { Expose, TypeHelpOptions, ClassConstructor, Type, DiscriminatorDescriptor } from 'class-transformer';

type DiscriminatorSettings<T, L extends string> = T extends { [label in L]: string }
	? {
			property: L;
			subTypes: { [key in T[L]]: ClassConstructor<T> };
	  }
	: never;

type ValueOf<T> = T[keyof T];
/**
 * Maps an object obj of type T to an array of objects containing the key of T in kProp and the value of T in vProp.
 */
const objectToArray = <T extends Record<string, unknown>>(obj: T): { name: string; value: ValueOf<T> }[] => {
	return Object.keys(obj).map(key => ({ name: key, value: obj[key] as ValueOf<T> }));
};

export const Accept = <T, P extends string & keyof T>(
	typeFunction?: (type?: TypeHelpOptions) => ClassConstructor<T>,
	discriminatorSettings?: DiscriminatorSettings<T, P>,
): PropertyDecorator => {
	return (target: Object, propertyKey: string | symbol) => {
		Expose()(target, propertyKey);

		let discriminator: DiscriminatorDescriptor | undefined = undefined;
		if (discriminatorSettings)
			discriminator = {
				property: discriminatorSettings.property,
				subTypes: objectToArray(discriminatorSettings.subTypes),
			};

		if (typeFunction) Type(typeFunction, { discriminator, keepDiscriminatorProperty: true })(target, propertyKey);
	};
};
