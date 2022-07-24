import { Component } from '@angular/core';
import { animate, animateChild, query, stagger, style, transition, trigger } from '@angular/animations';
import { MessageService } from 'src/services/message/message.service';

@Component({
	selector: 'app-messages',
	templateUrl: './messages.component.html',
	styleUrls: ['./messages.component.scss'],
	animations: [
		// nice stagger effect when showing existing elements
		trigger('list', [
			transition(':enter', [
				// child animation selector + stagger
				query('@item', stagger(250, animateChild()), {
					optional: true,
				}),
			]),
		]),
		trigger('item', [
			// cubic-bezier for a tiny bouncing feel
			transition(':enter', [
				style({ transform: 'scale(0.5)', opacity: 0 }),
				animate('.5s cubic-bezier(.8,0,0.2,1)', style({ transform: 'scale(1)', opacity: 1 })),
			]),
			transition(':leave', [
				style({ transform: 'scale(1)', opacity: 1, height: '*' }),
				animate(
					'.3s cubic-bezier(.8,0,0.2,1)',
					style({
						transform: 'scale(0)',
						opacity: 0,
						height: '0px',
						margin: '0em',
						padding: '0em',
					}),
				),
			]),
		]),
	],
})
export class MessagesComponent {
	constructor(readonly messageService: MessageService) {}
}
