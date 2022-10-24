import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MessagesComponent } from './messages.component';

describe('MessagesComponent', () => {
	let component: MessagesComponent;
	let fixture: ComponentFixture<MessagesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [BrowserAnimationsModule],
			declarations: [MessagesComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(MessagesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
