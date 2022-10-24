import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterTestingModule } from '@angular/router/testing';
import { KeycloakService } from 'keycloak-angular';
import { ShelfSearchComponent } from '../../shelf/shelf-search/shelf-search.component';
import { ShelfListComponent } from './shelf-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ShelfListComponent', () => {
	let component: ShelfListComponent;
	let fixture: ComponentFixture<ShelfListComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				HttpClientModule,
				RouterTestingModule,
				MatFormFieldModule,
				MatInputModule,
				FormsModule,
				ReactiveFormsModule,
				MatIconModule,
				BrowserAnimationsModule,
			],
			providers: [{ provide: KeycloakService, useValue: {} }],
			declarations: [ShelfListComponent, ShelfSearchComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ShelfListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
