import Errors, { createError, createErrors, removeError } from './../src/StandardError.js';
import { jest } from '@jest/globals';

const { StandardError, HttpError } = Errors;

test('Can create and throw a new StandardError Error', async() => {
	// Setup
	const TestError = createError({
		name: 'TestError',
		message: 'Testing ``prop`` (``extraProp``)',
		properties: [ 'prop' ],
		extraProps: {
			prop: {
				testProp: { extraProp: 'testExtraProp' }
			}
		}
	});

	// Execute
	let err;
	try {
		throw new TestError('testProp', 'testInfo');

	} catch (e) {
		err = e;
	}

	// Test
	expect(err.name).toEqual('TestError');
	expect(err.prop).toEqual('testProp');
	expect(err.extraProp).toEqual('testExtraProp');
	expect(err.message).toEqual('Testing testProp (testExtraProp)');
	expect(err.stack).not.toBe(undefined);
	expect(err.info).toEqual('testInfo');
	expect(err instanceof Error).toBe(true);
	expect(err instanceof StandardError).toBe(true);
	expect(err instanceof TestError).toBe(true);

	// Cleanup
	removeError('TestError');
});

test('Can create multiple StandardError Errors at once', async() => {
	// Setup
	const [ TestError, OtherTestError ] = createErrors([
		{
			name: 'TestError',
			message: 'Testing ``prop``',
			properties: [ 'prop' ]
		},
		{
			name: 'OtherTestError',
			message: 'Testing other error ``prop``',
			properties: [ 'prop' ]
		}
	]);

	// Execute
	let err, otherErr;
	try {
		throw new TestError('testProp', 'testInfo');

	} catch (e) {
		err = e;
	}

	try {
		throw new OtherTestError('otherTestProp', 'otherTestInfo');

	} catch (e) {
		otherErr = e;
	}

	// Test
	expect(err.name).toEqual('TestError');
	expect(err.prop).toEqual('testProp');
	expect(err.message).toEqual('Testing testProp');
	expect(err.info).toEqual('testInfo');
	expect(err instanceof TestError).toBe(true);

	expect(otherErr.name).toEqual('OtherTestError');
	expect(otherErr.prop).toEqual('otherTestProp');
	expect(otherErr.message).toEqual('Testing other error otherTestProp');
	expect(otherErr.info).toEqual('otherTestInfo');
	expect(otherErr instanceof OtherTestError).toBe(true);

	// Cleanup
	removeError('TestError');
	removeError('OtherTestError');
});
