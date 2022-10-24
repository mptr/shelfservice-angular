import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { NavComponent } from './nav/nav.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MessagesComponent } from './messages/messages.component';
import { FooterComponent } from './footer/footer.component';
import { AuthModule } from '../auth/auth.module';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';

describe('AppComponent', () => {
	let fixture: ComponentFixture<AppComponent>;
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				RouterTestingModule,
				BrowserAnimationsModule,
				AuthModule,
				MatSidenavModule,
				MatToolbarModule,
				MatMenuModule,
				MatIconModule,
				HttpClientModule,
				MatCardModule,
			],
			declarations: [AppComponent, NavComponent, SidebarComponent, MessagesComponent, FooterComponent],
		}).compileComponents();
		fixture = TestBed.createComponent(AppComponent);
	});

	const getCompiled = (loggedIn = false) => {
		fixture.componentRef.instance.isLoggedIn = loggedIn;
		fixture.detectChanges();
		return fixture.nativeElement as HTMLElement;
	};

	describe('page structure', () => {
		test.each([
			'app-nav',
			'app-nav + mat-drawer-container',
			'mat-drawer-container + app-messages',
			'app-messages + app-footer',
			'mat-drawer-container app-sidebar',
		])('should have %s', selector => {
			expect(getCompiled().querySelector(selector)).toBeTruthy();
		});

		it('should not have router outled when not logged in', () => {
			expect(getCompiled().querySelector('router-outlet')).toBeFalsy();
		});

		it('should have router outled when logged in', () => {
			expect(getCompiled(true).querySelector('mat-drawer-container router-outlet')).toBeTruthy();
		});
	});
});
