import { Injectable } from '@angular/core';
import { Message } from './Message';

@Injectable({
	providedIn: 'root',
})
export class MessageService {
	private _messages: Message[] = [];

	get messages(): Readonly<Message[]> {
		return this._messages;
	}

	push(message: Message): Message | null {
		if (this._messages.findIndex(m => m.equals(message)) >= 0) return null;
		this._messages.push(message);
		if (['info', 'success'].includes(message.kind)) setTimeout(() => this.dismiss(message), 5000);
		return message;
	}

	dismiss(message: Message): boolean {
		const index = this._messages.findIndex(m => m.equals(message));
		if (index !== -1) {
			this._messages.splice(index, 1);
			return true;
		}
		return false;
	}
}
