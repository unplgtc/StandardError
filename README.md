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

## Removing values from the StandardError object

If you need to remove the built-in HttpError object in order to create your own custom version, you can do so using the `removeError()` function:

```js
import { removeError } from '@unplgtc/standard-error';

removeError('HttpError');
```
