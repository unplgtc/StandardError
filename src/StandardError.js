'use strict';

const StandardError = {
	// Map new error codes into the StandardError Object
	expand(errors) {
		var verification = {
			passed: true
		}
		for (var key of Object.keys(errors)) {
			verification[key] = this.verify(key, errors[key]);
			if (verification[key].passed) {
				delete verification[key];
				this[key] = errors[key];
			} else {
				verification.passed = false;
			}
		}
		return verification;
	},

	// Codes that don't pass verification are rejected
	verify(key, error) {
		return {
			passed: error.code != undefined && key == error.code && !!error.domain && !!error.title && !!error.message && !this[error.code],
			...(error.code != undefined
			    ? !this[error.code]
			      ? key == error.code
			        ? null
			        : {code: 'Code does not match key'}
			      : {code: 'Code already in use'}
			    : {code: 'Missing Code'}),
			...(error.domain ? null : {domain: 'Missing Domain'}),
			...(error.title ? null : {title: 'Missing Title'}),
			...(error.message ? null : {message: 'Missing Message'})
		}
	}
}

const HttpErrors = {
	400: {code: 400, domain: 'generic', title: 'Bad Request', message: 'The server cannot or will not process the request'},

	401: {code: 401, domain: 'generic', title: 'Unauthorized', message: 'Authentication required'},

	403: {code: 403, domain: 'generic', title: 'Forbidden', message: 'Valid request, but the requested action is forbidden'},

	404: {code: 404, domain: 'generic', title: 'Not Found', message: 'The requested resource could not be found'},

	405: {code: 405, domain: 'generic', title: 'Method Not Allowed', message: 'The requested method is not supported for the requested resource'},

	500: {code: 500, domain: 'generic', title: 'Internal Error', message: 'Unexpected condition was encounterd'}
}

// Delegate from StandardError to HttpErrors
Object.setPrototypeOf(StandardError, HttpErrors);

module.exports = StandardError

