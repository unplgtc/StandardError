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
`('Expand StandardError object', ({key, code, domain, title, message, passed, errors}) => {
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
