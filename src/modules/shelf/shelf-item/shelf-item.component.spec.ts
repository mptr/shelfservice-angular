import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelfItemComponent } from './shelf-item.component';

describe('ShelfItemComponent', () => {
	let component: ShelfItemComponent;
	let fixture: ComponentFixture<ShelfItemComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ShelfItemComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ShelfItemComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
