import { TestBed } from '@angular/core/testing';
import { Message } from './Message';

import { MessageService } from './message.service';

describe('MessageService', () => {
	let service: MessageService;
	const m = new Message('title', 'message', 'success');
	const m2 = new Message('title2', 'message2', 'warning');

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(MessageService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should accept new messages', () => {
		expect(service.messages.length).toBe(0);

		expect(service.push(m)).toBe(m);
		expect(service.messages.length).toBe(1);
		expect(service.messages[0]).toBe(m);

		expect(service.push(m2)).toBe(m2);
		expect(service.messages.length).toBe(2);
		expect(service.messages[1]).toBe(m2);
	});

	it('should dismiss messages', () => {
		service.push(m);
		service.push(m2);

		expect(service.dismiss(m)).toBe(true);
		expect(service.messages.length).toBe(1);
		expect(service.messages[0]).toBe(m2);

		expect(service.dismiss(m)).toBe(false);
	});
});
