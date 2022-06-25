import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard extends KeycloakAuthGuard {
	constructor(protected keycloakService: KeycloakService, route: Router, protected auth: AuthService) {
		super(route, keycloakService);
	}

	async isAccessAllowed(route: ActivatedRouteSnapshot): Promise<boolean> {
		console.log(route);
		if (!this.authenticated) {
			//log in if not logged in
			await this.keycloakService.login({
				redirectUri: window.location.origin,
			});
			return false;
		}
		return true;
	}
}
