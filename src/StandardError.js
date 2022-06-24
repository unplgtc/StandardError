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

function createError({ name, message, properties, extraProps, logLevel, namespaceOnly, namespace = 'Default' }) {
	if (!Errors[namespace]) {
		Errors[namespace] = {};
	}

	if (Errors[namespace][name]) {
		if (namespace === 'Default') {
			throw new StandardError(
				'AlreadyExistsError',
				{ name },
				`A StandardError with name '${name}' already exists in the Default namespace. Add a namespace to error definition or give error a unique name.`
			);

		} else if (logLevel !== 'info') {
			console.log('WARN ** Error with given name and namespace already exists. Returing existing version rather than overwriting it. Pass `logLevel: "info"` to silence this warning.', { name, namespace });
		}

		return Errors[namespace][name];

	} else if (Errors[name]) {
		if (!namespaceOnly && logLevel !== 'info') {
			console.log('WARN ** Error with given name already exists in a different namespace. To access this new error, please use a namespaced call. Pass `logLevel: "info"` to silence this warning.', { name, namespace, existingErrorNamespace: Errors[name].namespace });
		}

		return Errors[namespace][name] = extendStandardError({ name, namespace, message, properties, extraProps });

	} else {
		const error = extendStandardError({ name, namespace, message, properties, extraProps });

		Errors[namespace][name] = error;
		!namespaceOnly && (Errors[name] = error);

		return error;
	}
}

function extendStandardError({ name, namespace, message, properties = [], extraProps }) {
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

			namespace !== 'Default' && (this.namespace = namespace);
		}
	});
}

function removeError({ name, namespaceOnly, namespace = 'Default' }) {
	if (name === 'StandardError') {
		throw new StandardError(
			'CannotRemoveStandardErrorError',
			undefined,
			'Removing the StandardError Error is not allowed'
		);
	}

	!namespaceOnly && delete Errors[name];
	delete Errors[namespace]?.[name];
}

// Register default error keys internally
import HttpError from './HttpError.js';
createError(HttpError);

export default Errors;
export { createErrors, createError, removeError };
