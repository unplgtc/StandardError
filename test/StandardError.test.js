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
	removeError({ name: 'TestError' });
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
	removeError({ name: 'TestError' });
	removeError({ name: 'OtherTestError' });
});

test('Can create and throw a StandardError without properties', async() => {
	// Setup
	const TestError = createError({
		name: 'TestError',
		message: 'Testing'
	});

	// Execute
	let err;
	try {
		throw new TestError('testInfo');

	} catch (e) {
		err = e;
	}

	// Test
	expect(err.name).toEqual('TestError');
	expect(err.message).toEqual('Testing');
	expect(err.stack).not.toBe(undefined);
	expect(err.info).toEqual('testInfo');
	expect(err instanceof Error).toBe(true);
	expect(err instanceof StandardError).toBe(true);
	expect(err instanceof TestError).toBe(true);

	// Cleanup
	removeError({ name: 'TestError' });
});

test('The "*" key on extraProps places the props on all instances', async() => {
	// Setup
	const TestError = createError({
		name: 'TestError',
		message: 'Testing ``testProp``',
		extraProps: { '*':  { testProp: 'star' }}
	});

	// Execute
	let err;
	try {
		throw new TestError('testInfo');

	} catch (e) {
		err = e;
	}

	// Test
	expect(err.name).toEqual('TestError');
	expect(err.message).toEqual('Testing star');
	expect(err.testProp).toEqual('star');
	expect(err.info).toEqual('testInfo');
	expect(err instanceof Error).toBe(true);
	expect(err instanceof StandardError).toBe(true);
	expect(err instanceof TestError).toBe(true);

	// Cleanup
	removeError({ name: 'TestError' });
});

test('Can create and throw namespaced StandardErrors', async() => {
	// Setup
	const [ Test1Error, Test2Error ] = createErrors([
		{
			name: 'TestError',
			namespace: 'Test1',
			message: 'Testing'
		},
		{
			name: 'TestError',
			namespace: 'Test2',
			message: 'Testing',
			logLevel: 'info'
		}
	]);

	// Execute
	let err1;
	try {
		throw new Errors.Test1.TestError('testInfo');

	} catch (e) {
		err1 = e;
	}

	let err2;
	try {
		throw new Errors.Test2.TestError('testInfo');

	} catch (e) {
		err2 = e;
	}

	// Test
	expect(err1.name).toEqual('TestError');
	expect(err1.namespace).toEqual('Test1');
	expect(err1.message).toEqual('Testing');
	expect(err1.stack).not.toBe(undefined);
	expect(err1.info).toEqual('testInfo');
	expect(err1 instanceof Error).toBe(true);
	expect(err1 instanceof StandardError).toBe(true);
	expect(err1 instanceof Test1Error).toBe(true);
	expect(err1 instanceof Test2Error).toBe(false);

	expect(err2.name).toEqual('TestError');
	expect(err2.namespace).toEqual('Test2');
	expect(err2.message).toEqual('Testing');
	expect(err2.stack).not.toBe(undefined);
	expect(err2.info).toEqual('testInfo');
	expect(err2 instanceof Error).toBe(true);
	expect(err2 instanceof StandardError).toBe(true);
	expect(err2 instanceof Test1Error).toBe(false);
	expect(err2 instanceof Test2Error).toBe(true);

	// Cleanup
	removeError({ name: 'TestError', namespace: 'Test1' });
	removeError({ name: 'TestError', namespace: 'Test2' });
});

test('Creating duplicate StandardErrors in the same namespace works but does not overwrite the first instance', async() => {
	// Setup
	const [ Test1Error, AlsoTest1Error ] = createErrors([
		{
			name: 'TestError',
			namespace: 'Test1',
			message: 'Testing'
		},
		{
			name: 'TestError',
			namespace: 'Test1',
			message: 'Testing',
			logLevel: 'info'
		}
	]);

	// Test
	expect(Test1Error).toBe(AlsoTest1Error);

	// Cleanup
	removeError({ name: 'TestError', namespace: 'Test1' });
});

test('Can create StandardErrors in a namespace without adding them to main Error object', async() => {
	// Setup
	const [ TestError, NamespaceOnlyTestError ] = createErrors([
		{
			name: 'TestError',
			namespace: 'Test1',
			message: 'Testing'
		},
		{
			name: 'NamespaceOnlyTestError',
			namespace: 'Test1',
			namespaceOnly: true,
			message: 'Testing'
		}
	]);

	// Test
	expect(Errors.TestError).toBe(TestError);
	expect(Errors.Test1.TestError).toBe(TestError);

	expect(Errors.NamespaceOnlyTestError).toBe(undefined);
	expect(Errors.Test1.NamespaceOnlyTestError).toBe(NamespaceOnlyTestError);

	// Cleanup
	removeError({ name: 'TestError', namespace: 'Test1'});
	removeError({ name: 'NamespaceOnlyTestError', namespace: 'Test1', namespaceOnly: true });
});
