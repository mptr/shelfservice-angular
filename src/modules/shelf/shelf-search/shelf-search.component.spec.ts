import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ShelfSearchComponent } from './shelf-search.component';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('ShelfSearchComponent', () => {
	let component: ShelfSearchComponent;
	let fixture: ComponentFixture<ShelfSearchComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				MatFormFieldModule,
				MatInputModule,
				BrowserAnimationsModule,
				MatIconModule,
				FormsModule,
				ReactiveFormsModule,
			],
			declarations: [ShelfSearchComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(ShelfSearchComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
