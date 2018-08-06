'use strict';

const StandardError = {
	list(domain) {
		var list = {};
		this.keys.map(key => this[key] && (!domain || this[key].domain == domain) ? list[key] = this[key] : null);
		return list;
	},

	listKeys(domain) {
		return this.keys.map(key => this[key] && (!domain || this[key].domain == domain) ? key : null)
		                .filter(key => key);
	},

	listErrors(domain) {
		return this.keys.map(key => this[key] && (!domain || this[key].domain == domain) ? this[key] : null)
		                .filter(key => key);
	},

	// Map new errors into the StandardError Object
	add(errors) {
		if (!Array.isArray(errors)) {
			errors = [errors];
		}
		return this.expand(errors);
	},

	// Remove errors from the StandardError Object
	remove(keys) {
		if (typeof keys == 'number') {
			keys = [keys];
		}
		this.deregisterAll(keys);
	},

	removeByDomain(domain) {
		this.deregisterByDomain(domain);
	}
}

const Internal = {
	keys: [],

	// Codes that don't pass verification are rejected
	verify(error) {
		return {
			passed: error.code != undefined && !!error.domain && !!error.title && !!error.message && !this[error.code],
			...(error.code != undefined
			    ? !this[error.code]
			      ? null
			      : {code: 'Code already in use'}
			    : {code: 'Missing Code'}),
			...(error.domain ? null : {domain: 'Missing Domain'}),
			...(error.title ? null : {title: 'Missing Title'}),
			...(error.message ? null : {message: 'Missing Message'})
		};
	},

	expand(errors) {
		var verification = {
			passed: true
		};
		for (var error of errors) {
			verification[error.code] = this.verify(error);
			if (verification[error.code].passed) {
				this.register(error.code.toString());
				this[error.code] = error;
				delete verification[error.code];
			} else {
				verification.passed = false;
			}
		}
		return verification;
	},

	register(key) {
		this.keys.push(key);
	},

	registerAll(keys) {
		for (var key of keys) {
			this.register(key);
		}
	},

	deregister(key) {
		if (this[key]) {
			this[key] = undefined;
			this.keys = this.keys.filter(_key => _key != key);
		}
	},

	deregisterAll(keys) {
		keys.map(key => this.deregister(key));
	},

	deregisterByDomain(domain) {
		this.deregisterAll(this.listKeys(domain));
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

// Register default error keys internally
Internal.registerAll(Object.keys(HttpErrors));

// Delegate StandardError -> Internal -> HttpErrors
Object.setPrototypeOf(StandardError, Internal);
Object.setPrototypeOf(Internal, HttpErrors);

module.exports = StandardError;
