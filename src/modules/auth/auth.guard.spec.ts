import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { KeycloakService } from 'keycloak-angular';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
	const keycloakMock = {
		login: jest.fn(),
	};
	let guard: AuthGuard & { authenticated: boolean };

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [AuthGuard, { provide: KeycloakService, useValue: keycloakMock }, { provide: Router, useValue: {} }],
			imports: [RouterTestingModule],
		});
		guard = TestBed.inject(AuthGuard) as AuthGuard & { authenticated: boolean }; // make authenticated accessible from outside
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be created', () => {
		expect(guard).toBeTruthy();
	});

	it('should return true if the user is authenticated', async () => {
		guard.authenticated = true;
		expect(await guard.isAccessAllowed()).toEqual(true);
	});

	it('should return true if the user is authenticated', async () => {
		guard.authenticated = false;
		expect(await guard.isAccessAllowed()).toEqual(false);
		expect(keycloakMock.login).toHaveBeenCalled();
	});
});
