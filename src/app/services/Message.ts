export class Message {
	private readonly id: number;
	constructor(
		public readonly title: string,
		public readonly desc: string,
		public readonly kind: 'error' | 'warning' | 'info' | 'success',
	) {
		this.id = Math.floor(Math.random() * 1000000);
	}
	equals(message: Message): boolean {
		return this.id === message.id;
	}
}
