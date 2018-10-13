'use strict';

const HttpCodes = require('./HttpCodes.js');

const StandardError = {
	// Output the StandardError Object, optionally filtered down to a particular domain
	show(domain) {
		var map = {};
		this.keys.map(key => this[key] &&
			                 (!domain || this[key]().domain == domain)
			                  ? map[key] = this[key]()
			                  : null);
		return map;
	},

	listKeys(domain) {
		return this.keys.map(key => this[key] &&
			                        (!domain || this[key]().domain == domain)
			                         ? key
			                         : null)
		                .filter(key => key);
	},

	listErrors(domain) {
		return this.keys.map(key => this[key] &&
			                        (!domain || this[key]().domain == domain)
			                         ? this[key]()
			                         : null)
		                .filter(key => key);
	},

	// Map new errors onto the StandardError Object
	add(errors) {
		if (!Array.isArray(errors)) {
			errors = [errors];
		}
		return this.expand(errors);
	},

	// Remove errors from the StandardError Object
	remove(keys) {
		if (!Array.isArray(keys)) {
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

	expand(errors) {
		var verification = {
			passed: true
		};
		for (var error of errors) {
			verification[error.code] = this.verify(error);
			if (verification[error.code].passed) {
				this.register(error.code.toString());
				this[error.code] = this.createError(error);
				delete verification[error.code];
			} else {
				verification.passed = false;
			}
		}
		return verification;
	},

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

	createError(error) {
		return (details) => {
			if (details == null) {
				return { ...error };
			} else {
				return { ...error, details: details };
			}
		};
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

// Delegate StandardError -> Internal
Object.setPrototypeOf(StandardError, Internal);

// Register default error keys internally
StandardError.add(HttpCodes);

module.exports = StandardError;
