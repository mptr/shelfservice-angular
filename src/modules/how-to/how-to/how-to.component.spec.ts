import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatCardModule } from '@angular/material/card';
import { HowToComponent } from './how-to.component';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('HowToComponent', () => {
	let component: HowToComponent;
	let fixture: ComponentFixture<HowToComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RouterTestingModule, MatCardModule, MatTabsModule, BrowserAnimationsModule],
			declarations: [HowToComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(HowToComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
