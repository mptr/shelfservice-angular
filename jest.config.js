const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	globalSetup: 'jest-preset-angular/global-setup',
	preset: 'jest-preset-angular',
	testMatch: ['<rootDir>/src/**/*.(spec|test).(ts|js)?(x)'],
	moduleFileExtensions: ['js', 'json', 'ts'],
	rootDir: '.',
	modulePaths: ['<rootDir>'],
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, { prefix: '<rootDir>' }),
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
	collectCoverage: true,
	coverageReporters: ['lcov', 'html'],
	coverageDirectory: 'coverage',
	collectCoverageFrom: ['src/services/workflow-worker/**/*.{ts,js}'],
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
