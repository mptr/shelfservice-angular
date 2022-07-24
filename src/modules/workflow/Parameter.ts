export class Parameter {
	name!: string;
	kind!: 'string' | 'number' | 'boolean' | 'date';
}

export class SetParameter extends Parameter {
	value?: string;
}
