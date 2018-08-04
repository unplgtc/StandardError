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

test.each`
	key    | code         | domain           | title        | message             | passed   | errors
	${600} | ${600}       | ${'application'} | ${'Test 1'}  | ${'This is a test'} | ${true}  | ${{}}
	${600} | ${700}       | ${'application'} | ${'Test 2'}  | ${'This is a test'} | ${false}  | ${{code: 'Code does not match key'}}
	${600} | ${600}       | ${'application'} | ${'Test 3'}  | ${'This is a test'} | ${false} | ${{code: 'Code already in use'}}
	${601} | ${undefined} | ${'application'} | ${'Test 4'}  | ${'This is a test'} | ${false} | ${{code: 'Missing Code'}}
	${602} | ${602}       | ${undefined}     | ${'Test 5'}  | ${'This is a test'} | ${false} | ${{domain: 'Missing Domain'}}
	${603} | ${603}       | ${'application'} | ${undefined} | ${'This is a test'} | ${false} | ${{title: 'Missing Title'}}
	${604} | ${604}       | ${'application'} | ${'Test 7'}  | ${undefined}        | ${false} | ${{message: 'Missing Message'}}
	${605} | ${700}       | ${'application'} | ${'Test 8'}  | ${undefined}        | ${false} | ${{code: 'Code does not match key',
	                                                                                              message: 'Missing Message'}}
	${606} | ${700}       | ${undefined}     | ${undefined} | ${undefined}        | ${false} | ${{code: 'Code does not match key',
	                                                                                              domain: 'Missing Domain',
	                                                                                              title: 'Missing Title',
	                                                                                              message: 'Missing Message'}}
	${607} | ${607}       | ${'application'} | ${'Test 10'} | ${'This is a test'} | ${true}  | ${{}}
`(`Expanding StandardError object does output expected verification success and error messages`, ({key, code, domain, title, message, passed, errors}) => {
	// Setup
	var data = {};
	data[key] = {code: code, domain: domain, title: title, message: message};

	// Execute
	var verification = StandardError.expand(data);

	// Test
	expect(verification.passed).toEqual(passed);
	if (!verification.passed) {
		expect(verification[key].passed).toEqual(passed);
		for (var errorKey of Object.keys(verification[key])) {
			if (errorKey != 'passed') {
				expect(errors[errorKey]).toEqual(verification[key][errorKey]);
			}
		}
	}
});

test('Expanding StandardError object with blob of multiple new errors fails malformed errors individually', async() => {
	// Setup
	var data = {
		500: {code: 500, domain: 'application', title: 'Test 1', message: '500 is already taken by the default StandardError object'},
		801: {code: 801, domain: undefined, title: 'Test 2', message: 'Error with undefined domain'},
		802: {code: 802, domain: 'application', title: undefined, message: 'Error with undefined title'},
		803: {code: 803, domain: 'application', title: 'Test 4', message: undefined},
		804: {code: 804, domain: 'application', title: 'Test 5', message: 'Well formed error, will be added successfully'}
	};

	// Execute
	var verification = StandardError.expand(data);

	// Test
	expect(verification.passed).toEqual(false);

	// Failed 500 and did not overwrite existing 500 error
	expect(verification[500].passed).toEqual(false);
	expect(verification[500].code).toEqual('Code already in use');
	expect(StandardError[500]).not.toEqual(data[500]);

	// Failed 801 error
	expect(verification[801].passed).toEqual(false);
	expect(verification[801].domain).toEqual('Missing Domain');
	expect(StandardError[801]).toEqual(undefined);

	// Failed 802 error
	expect(verification[802].passed).toEqual(false);
	expect(verification[802].title).toEqual('Missing Title');
	expect(StandardError[802]).toEqual(undefined);

	// Failed 803 error
	expect(verification[803].passed).toEqual(false);
	expect(verification[803].message).toEqual('Missing Message');
	expect(StandardError[803]).toEqual(undefined);

	// Passed 804 error
	expect(StandardError[804]).toEqual(data[804]);
});

test('Can expand StandardError object with blob of multiple new errors with one call', async() => {
	// Setup
	var data = {
		700: {code: 700, domain: 'application', title: 'Test 1', message: 'This is a test error message'},
		701: {code: 701, domain: 'application', title: 'Test 2', message: 'This is a test error message'},
		702: {code: 702, domain: 'application', title: 'Test 3', message: 'This is a test error message'},
		703: {code: 703, domain: 'application', title: 'Test 4', message: 'This is a test error message'}
	};

	// Execute
	var verification = StandardError.expand(data);

	// Test
	expect(verification.passed).toEqual(true);
	expect(StandardError[700]).toEqual(data[700]);
	expect(StandardError[701]).toEqual(data[701]);
	expect(StandardError[702]).toEqual(data[702]);
	expect(StandardError[703]).toEqual(data[703]);
});
