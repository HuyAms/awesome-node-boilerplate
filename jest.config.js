/**
 * Jest configuration
 *
 */

module.exports = {
	preset: 'ts-jest',
	collectCoverageFrom: ['src/**/*.{js,ts}', '!src/**/*.test.{js,ts}'],
	// individual test will be reported
	verbose: true,
	// Automatically clear mock calls and instances between every test
	clearMocks: true,
	moduleDirectories: ['node_modules', 'src'],
	moduleFileExtensions: ['ts', 'js', 'node', 'json'],
	setupFilesAfterEnv: [
		'<rootDir>/src/tests/testSetup.ts',
		'<rootDir>/src/tests/customMatcher.ts',
	],
	testEnvironment: 'node',
	testPathIgnorePatterns: ['/node_modules/', '/dist/'],
	// configure minimum threshold enforcement for coverage results
	// https://jestjs.io/docs/en/configuration#coveragethreshold-object
	// coverageThreshold: {
	// 	global: {
	// 		branches: 80,
	// 		functions: 80,
	// 		lines: 80,
	// 		statements: -10,
	// 	},
	// },
}
