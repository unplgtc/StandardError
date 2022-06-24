[![CircleCI master build status](https://img.shields.io/circleci/project/github/unplgtc/StandardError/master.svg?label=master&logo=circleci)](https://circleci.com/gh/unplgtc/StandardError/tree/master)
[![npm version](https://img.shields.io/npm/v/@unplgtc/standard-error.svg)](https://www.npmjs.com/package/@unplgtc/standard-error)

# StandardError

### A simple package for easily extending the JavaScript Error class to provide custom Errors tailored to your project.

StandardError enables the easy creation of custom Error objects which inherit from the JavaScript Error class itself. Throwing with StandardError Errors results in an injection of clearly identifiable and traceable errors throughout your application.

StandardError packages a generic `HttpError`, but can easily be expanded to support custom, domain-specific errors using its `createError()` function.

## Usage

Expand StandardError with a custom error:

```js
import { createError } from '@unplgtc/standard-error';

createError({
	name: 'HttpError',
	message: 'Request failed with status code ``statusCode`` (``title``)',
	properties: [ 'statusCode' ],
	extraProps: {
		statusCode: {
			400: { title: 'Bad Request', details: 'The server cannot or will not process the request' },
			500: { title: 'Internal Error', details: 'Unexpected condition was encountered' }
		}
	}
});
```

The `message` argument has a special feature. During instantiation, any property names (including matched properties from `extraProps`) that are surrounded by double back-ticks (such as `\`\`statusCode\`\`` and `\`\`title\`\`` above) will be replaced by their actual values for that error instance.

Expand StandardError with multiple custom errors at once:

```js
import { createErrors } from '@unplgtc/standard-error';

createErrors([
	{
		name: 'HttpError',
		message: 'Request failed with status code ``statusCode``',
		properties: [ 'statusCode' ]
	},
	{
		name: 'ValidationError',
		message: 'Request failed validation'
	}
]);
```

Throw with StandardError Errors during execution:

```js
import { HttpError } from '@unplgtc/standard-error';

throw new HttpError(500);
```

All StandardErrors support the inclusion of runtime details as the final argument to a newly instantiated Error:

```js
import { HttpError } from '@unplgtc/standard-error';

throw new HttpError(500, { route: '/authenticate' });
```

## Namespacing Errors
StandardError supports adding errors by namespace, which can help handle the complexities of implementing StandardError across interconnected packages.

```js
// Startup.js
import { createError } from '@unplgtc/standard-error';

createError({
	name: 'HttpError',
	namespace: 'HttpRequest',
	message: 'Request failed with status code ``statusCode`` (``title``)',
	properties: [ 'statusCode' ]
});

// Service.js
import { HttpRequest } from '@unplgtc/standard-error';

throw new HttpRequest.HttpError(500);
```

Namespaced errors are still added to the main StandardError object if no other error exists with the given namespace and name. This allows you to add namespaces without increasing the complexity of using StandardError. Adding namespaces is good practice; in the case that you import another package which used the same error name in a different namespace, StandardError will give you a warning when the non-uniquely named error is added. You can disable this warning by passing `logLevel: info` to your `createError` call.

If you create a StandardError with the same name _and_ namespace as an existing error, StandardError will return the existing error rather than overwriting it. This prevents issues with importing different versions of the same package, which would otherwise result in duplicate errors being created. That said, StandardError will log a warning any time this occurs to help prevent unknown discrepancies if your StandardErrors have been updated in different package versions. If this warning is not useful to you, just pass `logLevel: 'info'` to your `createError` call to silence it.

If you do not pass a namespace to a `createError` call, the error will be created in the 'Default' namespace. Adding errors with non-unique names to the Default namespace is not supported, and will result in an AlreadyExistsError being thrown.

If you want to create StandardErrors _without_ adding the errors to the main Object (useful for private errors in packages which may want to use common error names without taking those spots for any projects that may import them), just pass `namespaceOnly: true` to your `createError` call.

## Anatomy of a StandardError Error

StandardError Errors accept `name`, `message`, `properties`, and `extraProps` parameters. `name` and `message` are required, but `properties` and `extraProps` are optional. On a StandardError object, you'll always be able to access `.name` and `.message`. You'll also be able to access all properties that were passed in via the `properties` array. These properties should be passed as arguments to any newly instantiated instance of a StandardError.

`extraProps` are matches against the values of properties on each newly instantiated StandardError. Using the built-in `HttpError` as an example, the `extraProps` argument matches against the `statusCode` property. Any time an `HttpError` is created with a `statusCode` of `400`, the extra properties `title` and `details` will be automatically added to the resulting Error object.

```js
import { HttpError } from '@unplgtc/standard-error';

try {
	throw new HttpError(400, { runtimeDetail: 'some_detail' });

} catch (err) {
	console.log(err.message); // Request failed with status code 400 (Bad Request)
	console.log(err.name); // HttpError
	console.log(err.namespace); // Default
	console.log(err.statusCode); // 400
	console.log(err.title); // Bad Request
	console.log(err.details); // The server cannot or will not process the request
	console.dir(err.info); // { runtimeDetail: 'some_detail' }
	console.log(err.stack); // [a stacktrace from the thrown error]
	console.log(err instanceof Error) // true
	console.log(err instanceof StandardError) // true
	console.log(err instanceof HttpError) // true
}
```

You can add a "*" key to `extraProps` to define any properties that should exist on _all instances_ of your StandardError Errors. This can be useful to add some domain-specific details to an otherwise generic-seeming Error name, such as specifying the service that the Error was created for.

```js
import { createError } from '@unplgtc/standard-error';

const ValidationError = createError({
	name: 'ValidationError',
	message: 'Request failed validation in ``service``'
	extraProps: {
		'*': { service: 'apiService' }
	}
});

try {
	throw new ValidationError();

} catch (err) {
	console.log(err.message); // Request failed validation in apiService
	console.log(err.name); // ValidationError
	console.log(err.service); // apiService
}
```

## Removing values from the StandardError object

If you need to remove the built-in HttpError object in order to create your own custom version, you can do so using the `removeError()` function:

```js
import { removeError } from '@unplgtc/standard-error';

removeError('HttpError');
```
