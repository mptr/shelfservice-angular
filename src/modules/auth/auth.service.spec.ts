import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { KeycloakService } from 'keycloak-angular';
import { AuthService } from './auth.service';

describe('AuthService', () => {
	const keycloakMock = {
		isLoggedIn: jest.fn(),
		getToken: jest.fn(),
		login: jest.fn(),
		logout: jest.fn(),
	};
	const routerMock = {
		navigate: jest.fn(),
	};
	let service: AuthService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				AuthService,
				{ provide: KeycloakService, useValue: keycloakMock },
				{ provide: Router, useValue: routerMock },
			],
			imports: [RouterTestingModule],
		});
		service = TestBed.inject(AuthService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should return login status', async () => {
		const r = Math.random();
		jest.spyOn(keycloakMock, 'isLoggedIn').mockResolvedValue(r);
		expect(await service.isLoggedIn).toBe(r);
	});

	it('should return profile', async () => {
		jest
			.spyOn(keycloakMock, 'getToken')
			.mockResolvedValue(
				'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZ2l2ZW5fbmFtZSI6IkpvaG4iLCJmYW1pbHlfbmFtZSI6IkRvZSIsImVtYWlsIjoiam9obi5kb2VAdGVzdC5kZSIsInByZWZlcnJlZF91c2VybmFtZSI6Impkb2UiLCJpYXQiOjE1MTYyMzkwMjJ9.WNdXd0a3qFTrJu3E4bKkTClA54JFmRBAnjToMtt0eso',
			);
		expect(await service.profile).toMatchObject({
			given_name: 'John',
			family_name: 'Doe',
			email: 'john.doe@test.de',
			preferred_username: 'jdoe',
		});
	});

	it('should login', async () => {
		const r = Math.random();
		const options = { redirectUri: 'test' };
		jest.spyOn(keycloakMock, 'login').mockResolvedValue(r);
		expect(await service.login(options)).toBe(r);
		expect(keycloakMock.login).toHaveBeenCalledWith(options);
	});

	it('should logout', async () => {
		const redirectUri = 'test';
		jest.spyOn(keycloakMock, 'logout').mockReturnValue(Promise.resolve());
		jest.spyOn(routerMock, 'navigate').mockReturnValue(Promise.resolve());
		await expect(service.logout(redirectUri)).resolves.toBe(undefined);
		expect(keycloakMock.logout).toHaveBeenCalledWith(redirectUri);
	});
});
