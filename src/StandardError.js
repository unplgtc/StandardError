class StandardError extends Error {
	constructor(name, info, message) {
		super(name);
		this.name = name;
		this.info = info;
		this.message = message;
	}
}

const Errors = { StandardError };

function createErrors(errors) {
	if (!Array.isArray(errors)) {
		errors = [errors];
	}

	return errors.map(error => createError(error))
}

function createError({ name, message, properties, extraProps }) {
	if (Errors[name]) {
		throw new StandardError(
			'AlreadyExistsError',
			{ name },
			`A StandardError with name '${name}' already exists`
		);
	}

	return Errors[name] = extendStandardError({ name, message, properties, extraProps });
}

function extendStandardError({ name, message, properties = [], extraProps }) {
	return (class extends StandardError {
		constructor(...args) {
			// If more args passed than props, assume final arg is the `info` prop
			const info = args.length > properties.length ? args.pop() : undefined;
			super(name, info);

			for (let i = 0; i < properties.length; i++) {
				this[properties[i]] = args[i];

				let matchedProps;
				if (matchedProps = extraProps?.[properties[i]]?.[args[i]]) {
					Object.assign(this, matchedProps);
				}
			}

			if (extraProps?.['*']) {
				Object.assign(this, extraProps['*']);
			}

			this.message = message.split('``')
				.map(it => this[it] ? (this[it]) : it)
				.join('');
		}
	});
}

function removeError(name) {
	if (name === 'StandardError') {
		throw new StandardError(
			'CannotRemoveStandardErrorError',
			undefined,
			'Removing the StandardError Error is not allowed'
		);
	}

	delete Errors[name];
}

// Register default error keys internally
import HttpError from './HttpError.js';
createError(HttpError);

export default Errors;
export { createErrors, createError, removeError };
