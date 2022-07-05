import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AppComponent } from './app.component';
import { NavComponent } from './components/nav/nav.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MessagesComponent } from './components/messages/messages.component';
import { FooterComponent } from './components/footer/footer.component';
import { AuthModule } from './auth/auth.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

describe('AppComponent', () => {
	let compiled: HTMLElement;

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
			],
			declarations: [AppComponent, NavComponent, SidebarComponent, MessagesComponent, FooterComponent],
		}).compileComponents();
		const fixture = TestBed.createComponent(AppComponent);
		fixture.detectChanges();
		compiled = fixture.nativeElement as HTMLElement;
	});

	describe('page structure', () => {
		test.each([
			'app-nav',
			'app-nav + mat-drawer-container',
			'mat-drawer-container + app-messages',
			'app-messages + app-footer',
			'mat-drawer-container app-sidebar',
			'mat-drawer-container router-outlet',
		])('should have %s', selector => {
			expect(compiled.querySelector(selector)).toBeTruthy();
		});
	});
});
