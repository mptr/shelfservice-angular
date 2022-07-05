import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { initalizer } from './keycloak-initializer';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@NgModule({
	declarations: [],
	imports: [KeycloakAngularModule, CommonModule],
	providers: [
		{
			provide: APP_INITIALIZER,
			useFactory: initalizer,
			multi: true,
			deps: [KeycloakService],
		},
		AuthGuard,
		AuthService,
	],
})
export class AuthModule {}
