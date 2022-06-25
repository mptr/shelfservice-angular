import { defineConfig } from 'cypress';

export default defineConfig({
	fixturesFolder: 'cypress/fixtures',
	screenshotsFolder: 'cypress/screenshots',
	videosFolder: 'cypress/videos',
	video: false,
	e2e: {
		setupNodeEvents(on, config) {
			return require('./cypress/plugins/index.ts')(on, config);
		},
		baseUrl: 'http://localhost:4200',
	},
});
