import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/services/rest/rest.service';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.entity';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
	constructor(public readonly auth: AuthService, private readonly rest: RestService) {}

	isLoggedIn = false;

	ngOnInit(): void {
		this.auth.isLoggedIn
			.then(r => (this.isLoggedIn = r))
			.then(() => this.auth.profile)
			.then(profile => {
				if (!profile.preferred_username) throw new Error('No username found in profile');
				this.rest.new.navigate('users').navigate(profile.preferred_username, User).put(profile);
			});
	}
}
