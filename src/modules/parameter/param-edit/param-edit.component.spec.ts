import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamEditComponent } from './param-edit.component';

describe('ParamEditComponent', () => {
	let component: ParamEditComponent;
	let fixture: ComponentFixture<ParamEditComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ParamEditComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(ParamEditComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
