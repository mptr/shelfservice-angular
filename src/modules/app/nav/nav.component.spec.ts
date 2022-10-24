import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../auth/auth.service';
import { NavComponent } from './nav.component';

describe('NavComponent', () => {
	let component: NavComponent;
	let fixture: ComponentFixture<NavComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [NavComponent],
			imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatMenuModule],
			providers: [
				{
					provide: AuthService,
					useValue: {
						isLoggedIn: Promise.resolve(true),
						profile: Promise.resolve({
							firstName: 'John',
							lastName: 'Doe',
							username: 'jdoe',
						}),
					},
				},
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(NavComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should show username when logged in', () => {
		fixture.detectChanges();
		expect(fixture.nativeElement.querySelector('mat-toolbar .spacer + button').textContent).toContain('jdoe');
	});

	it('should show login button when not logged in', async () => {
		component.loginStatus = false;
		fixture.detectChanges();
		await fixture.whenStable();
		expect(fixture.nativeElement.querySelector('mat-toolbar .spacer + button').textContent).toContain('Login');
	});
});
