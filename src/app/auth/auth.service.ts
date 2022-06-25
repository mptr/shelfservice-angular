import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	constructor(private readonly keycloak: KeycloakService, private readonly router: Router) {}

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
	private parseToken(token: string): {
		firstName: string;
		lastName: string;
		email: string;
		username: string;
	} {
		// parse JWT
		const base64Url = token.split('.')[1];
		const base64 = base64Url.replace('-', '+').replace('_', '/');
		const r = JSON.parse(window.atob(base64));
		console.log(r);
		// extract required attributes
		return {
			firstName: r.given_name,
			lastName: r.family_name,
			email: r.email,
			username: r.preferred_username,
		};
	}

	/**
	 * Returns the user object from the keycloak token if it exists
	 */
	get profile() {
		return this.authToken.then(tok => this.parseToken(tok));
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
		await this.keycloak.logout(redirectUri);
		await this.router.navigate(['/']);
	}
}
