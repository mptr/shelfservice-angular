import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { KeycloakService } from 'keycloak-angular';

import { ShelfItemComponent } from './shelf-item.component';

describe('ShelfItemComponent', () => {
	let component: ShelfItemComponent;
	let fixture: ComponentFixture<ShelfItemComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MatDialogModule, RouterTestingModule, HttpClientModule],
			providers: [{ provide: KeycloakService, useValue: {} }],
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
