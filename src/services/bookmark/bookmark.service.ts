import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Message } from '../message/Message';
import { MessageService } from '../message/message.service';

@Injectable({
	providedIn: 'root',
})
export class BookmarkService {
	private readonly key = 'bookmarks';
	private readonly collection: Set<string>;
	public readonly subject = new ReplaySubject<Set<string>>(1);

	constructor(private messageService: MessageService) {
		console.log('persist', localStorage.getItem(this.key));
		this.collection = new Set(JSON.parse(localStorage.getItem(this.key) || '[]'));
		console.log('c', this.collection);
		this.subject.next(this.collection);
	}

	private persist() {
		this.subject.next(this.collection);
		try {
			localStorage.setItem(this.key, JSON.stringify(Array.from(this.collection)));
		} catch (e) {
			this.messageService.push(new Message('Fehler', 'Lesezeichen konnte nicht gespeichert werden.', 'error'));
		}
	}

	public add(x: string) {
		this.collection.add(x);
		this.persist();
	}
	public delete(x: string) {
		const r = this.collection.delete(x);
		this.persist();
		return r;
	}
}
