'use strict';

/* * * * * * *
 *           *
 *  IMPORTS  *
 *           *
 * * * * * * */

const StandardError = require('./../src/StandardError');

/* * * * * *
 *         *
 *  TESTS  *
 *         *
 * * * * * */

test('Can output all errors as Object with codes as keys', async() => {
	// Execute
	var map = StandardError.show();

	// Test
	expect(map[500]).toEqual(StandardError[5000]);
});

test('Can list all error keys', async() => {
	// Execute
	var list = StandardError.listKeys();

	// Test
	expect(list).toContain('500');
});

test('Can list all error Objects', async() => {
	// Execute
	var list = StandardError.listErrors();

	// Test
	expect(list).toContain(StandardError[500]);
});

test.each`
	code         | domain           | title        | message             | passed   | errors
	${600}       | ${'application'} | ${'Test 1'}  | ${'This is a test'} | ${true}  | ${{}}
	${600}       | ${'application'} | ${'Test 2'}  | ${'This is a test'} | ${false} | ${{code: 'Code already in use'}}
	${undefined} | ${'application'} | ${'Test 3'}  | ${'This is a test'} | ${false} | ${{code: 'Missing Code'}}
	${602}       | ${undefined}     | ${'Test 4'}  | ${'This is a test'} | ${false} | ${{domain: 'Missing Domain'}}
	${603}       | ${'application'} | ${undefined} | ${'This is a test'} | ${false} | ${{title: 'Missing Title'}}
	${604}       | ${'application'} | ${'Test 6'}  | ${undefined}        | ${false} | ${{message: 'Missing Message'}}
	${600}       | ${'application'} | ${'Test 7'}  | ${undefined}        | ${false} | ${{code: 'Code already in use',
	                                                                                     message: 'Missing Message'}}
	${600}       | ${undefined}     | ${undefined} | ${undefined}        | ${false} | ${{code: 'Code already in use',
	                                                                                     domain: 'Missing Domain',
	                                                                                     title: 'Missing Title',
	                                                                                     message: 'Missing Message'}}
	${607}       | ${'application'} | ${'Test 9'}  | ${'This is a test'} | ${true}  | ${{}}
`(`Expanding StandardError object does output expected verification success and error messages`, ({key, code, domain, title, message, passed, errors}) => {
	// Setup
	var data = {code: code, domain: domain, title: title, message: message};

	// Execute
	var verification = StandardError.add(data);

	// Test
	expect(verification.passed).toEqual(passed);
	if (!verification.passed) {
		expect(verification[code].passed).toEqual(passed);
		for (var errorKey of Object.keys(verification[code])) {
			if (errorKey != 'passed') {
				expect(errors[errorKey]).toEqual(verification[code][errorKey]);
			}
		}
	}
});

test('Expanding StandardError object with blob of multiple new errors fails malformed errors individually', async() => {
	// Setup
	var data = [
		{code: 500, domain: 'application', title: 'Test 1', message: '500 is already taken by the default StandardError object'},
		{code: 701, domain: undefined, title: 'Test 2', message: 'Error with undefined domain'},
		{code: 702, domain: 'application', title: undefined, message: 'Error with undefined title'},
		{code: 703, domain: 'application', title: 'Test 4', message: undefined},
		{code: 704, domain: 'application', title: 'Test 5', message: 'Well formed error, will be added successfully'}
	];

	// Execute
	var verification = StandardError.add(data);

	// Test
	expect(verification.passed).toEqual(false);

	// Failed 500 and did not overwrite existing 500 error
	expect(verification[500].passed).toEqual(false);
	expect(verification[500].code).toEqual('Code already in use');
	expect(StandardError[500]).not.toEqual(data.filter(error => error.code == 500)[0]);

	// Failed 801 error
	expect(verification[701].passed).toEqual(false);
	expect(verification[701].domain).toEqual('Missing Domain');
	expect(StandardError[701]).toEqual(undefined);

	// Failed 802 error
	expect(verification[702].passed).toEqual(false);
	expect(verification[702].title).toEqual('Missing Title');
	expect(StandardError[702]).toEqual(undefined);

	// Failed 803 error
	expect(verification[703].passed).toEqual(false);
	expect(verification[703].message).toEqual('Missing Message');
	expect(StandardError[703]).toEqual(undefined);

	// Passed 804 error
	expect(StandardError[704]).toEqual(data.filter(error => error.code == 704)[0]);
});

test('Can expand StandardError object with blob of multiple new errors with one call', async() => {
	// Setup
	var data = [
		{code: 800, domain: 'application', title: 'Test 1', message: 'This is a test error message'},
		{code: 801, domain: 'application', title: 'Test 2', message: 'This is a test error message'},
		{code: 802, domain: 'application', title: 'Test 3', message: 'This is a test error message'},
		{code: 803, domain: 'application', title: 'Test 4', message: 'This is a test error message'}
	];

	// Execute
	var verification = StandardError.add(data);

	// Test
	expect(verification.passed).toEqual(true);
	expect(StandardError[800]).toEqual(data.filter(error => error.code == 800)[0]);
	expect(StandardError[801]).toEqual(data.filter(error => error.code == 801)[0]);
	expect(StandardError[802]).toEqual(data.filter(error => error.code == 802)[0]);
	expect(StandardError[803]).toEqual(data.filter(error => error.code == 803)[0]);
});

test('Can output all errors by domain as Object with codes as keys', async() => {
	// Execute
	var map = StandardError.show('application');

	// Test
	expect(map[500]).toEqual(undefined);
	expect(map[600]).toEqual(StandardError[600]);
});

test('Can list all error keys by domain', async() => {
	// Execute
	var list = StandardError.listKeys('application');

	// Test
	expect(list).not.toContain('500');
	expect(list).toContain('600');
});

test('Can list all errors by domain as list of Objects', async() => {
	// Execute
	var list = StandardError.listErrors('application');

	// Test
	expect(list).not.toContain(StandardError[500]);
	expect(list).toContain(StandardError[600]);
});

test('Can remove errors by key from StandardError Object', async() => {
	// Verify that 500 error exists
	expect(StandardError[500]).not.toEqual(undefined);
	expect(StandardError.listKeys()).toContain('500');

	// Execute
	StandardError.remove(500);

	// Test
	expect(StandardError[500]).toEqual(undefined);
	expect(StandardError.listKeys()).not.toContain('500');
});

test('Can remove errors by domain from StandardError Object', async() => {
	// Verify that 500 error exists
	expect(StandardError[600]).not.toEqual(undefined);
	expect(StandardError.listKeys()).toContain('600');

	// Execute
	StandardError.removeByDomain('application');

	// Test
	expect(StandardError[600]).toEqual(undefined);
	expect(StandardError.listKeys()).not.toContain('600');
});
