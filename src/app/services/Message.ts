import { v4 } from 'uuid';

export class Message {
	private readonly id: string;
	constructor(
		public readonly title: string,
		public readonly desc: string,
		public readonly kind: 'error' | 'warning' | 'info' | 'success',
	) {
		this.id = v4();
	}
	equals(message: Message): boolean {
		return this.id === message.id;
	}
}
