const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	globalSetup: 'jest-preset-angular/global-setup',
	preset: 'jest-preset-angular',
	testMatch: ['<rootDir>/src/**/*.(spec|test).(ts|js)?(x)'],
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, { prefix: '<rootDir>' }),
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
	collectCoverage: true,
	coverageReporters: ['lcov', 'html'],
	coverageDirectory: 'coverage',
	coveragePathIgnorePatterns: ['<rootDir>/build/', '<rootDir>/node_modules/', '<rootDir>/src/generated/'],
	reporters: [
		'default',
		[
			'jest-junit',
			{
				outputDirectory: 'test',
				outputName: 'jest-junit-report.xml',
			},
		],
	],
};
