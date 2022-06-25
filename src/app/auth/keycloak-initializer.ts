import { KeycloakOptions, KeycloakService } from 'keycloak-angular';
import { environment } from 'src/environments/environment';

export function initalizer(keycloak: KeycloakService): () => Promise<boolean> {
	const options: KeycloakOptions = {
		config: environment.keycloak,
		initOptions: {
			onLoad: 'check-sso',
			silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
			pkceMethod: 'S256',
		},
	};
	return () => keycloak.init(options);
}
