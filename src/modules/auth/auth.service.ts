import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { RestService } from 'src/services/rest/rest.service';
import { User } from './user.entity';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private userCache?: User;
	constructor(
		private readonly keycloak: KeycloakService,
		private readonly router: Router,
		private readonly rest: RestService,
	) {}

	get isLoggedIn(): Promise<boolean> {
		return this.keycloak.isLoggedIn();
	}

	get authToken(): Promise<string> {
		return this.keycloak.getToken();
	}

	/**
	 * @param token Keycloak Token
	 * @returns Part of the User Object from Keycloak
	 */
	private parseToken(token: string): User {
		// parse JWT
		const base64Url = token.split('.')[1];
		const base64 = base64Url.replace('-', '+').replace('_', '/');
		const r = JSON.parse(window.atob(base64));
		// extract required attributes
		return new User(r);
	}

	/**
	 * Returns the user object from the keycloak token if it exists
	 */
	get profile() {
		return this.authToken.then(tok => this.parseToken(tok));
	}

	async currentUser(): Promise<User> {
		if (!this.userCache) this.userCache = await this.rest.new.navigate('users', User).getOne('self');
		return this.userCache;
	}

	/**
	 * @param options Options for the keycloak login
	 * @returns Promise that resolves when the login is complete
	 */
	public login(options?: Keycloak.KeycloakLoginOptions): Promise<void> {
		return this.keycloak.login(options);
	}

	/**
	 * @param redirectUri URI to redirect to after logout
	 * @returns Promise that resolves when the logout is complete
	 */
	public async logout(redirectUri?: string): Promise<void> {
		this.userCache = undefined;
		await this.keycloak.logout(redirectUri);
		await this.router.navigate(['/']);
	}
}
