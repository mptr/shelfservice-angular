// Plugins enable you to tap into, modify, or extend the internal behavior of Cypress
// For more info, visit https://on.cypress.io/plugins-api
module.exports = (on: Cypress.Actions, config: Cypress.Config) => {
	// print browser console messages to cypress log
	require('cypress-log-to-output').install(on);

	// print detailed logs of cypress to see what is going on in ci env
	require('cypress-terminal-report/src/installLogsPrinter')(on, {
		printLogsToConsole: 'always',
	});
};
