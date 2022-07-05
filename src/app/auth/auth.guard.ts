import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';

@Injectable()
export class AuthGuard extends KeycloakAuthGuard {
	constructor(protected route: Router, protected keycloakService: KeycloakService) {
		super(route, keycloakService);
	}

	async isAccessAllowed(): Promise<boolean> {
		if (!this.authenticated) {
			// log in if not logged in
			await this.keycloakService.login({
				redirectUri: window.location.origin,
			});
			return false;
		}
		return true;
	}
}
