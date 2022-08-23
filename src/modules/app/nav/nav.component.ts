import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/modules/auth/auth.service';

@Component({
	selector: 'app-nav',
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
	constructor(readonly authService: AuthService) {}

	loginStatus = false;
	usernameDisplay?: string;
	async ngOnInit() {
		this.loginStatus = await this.authService.isLoggedIn;
		if (this.loginStatus) {
			const p = await this.authService.profile;
			this.usernameDisplay = `${p.name} (${p.preferred_username})`;
		}
	}

	@Output()
	toggleSide = new EventEmitter();

	@Input()
	sidebarState = false;
}
