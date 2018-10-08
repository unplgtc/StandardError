[![CircleCI master build status](https://img.shields.io/circleci/project/github/unplgtc/StandardError/master.svg?label=master&logo=circleci)](https://circleci.com/gh/unplgtc/StandardError/tree/master)
[![npm version](https://img.shields.io/npm/v/@unplgtc/standard-error.svg)](https://www.npmjs.com/package/@unplgtc/standard-error)

# StandardError

### Expandable standardized error object for improved logging and error handling in Node applications.

StandardError empowers services to explicitly define and register a set of their own domain-specific error objects. During execution services can then return, reject, or throw with these errors, resulting in an injection of clearly identifiable and traceable errors throughout your application.

StandardError comes equipped with a generic set of common HTTP errors, but can easily be expanded to support custom, domain-specific errors using its `add()` function. All custom errors are verified to fit the expected format and to check for conflicts before being allowed onto the StandardError object.

## Usage

Import StandardError into a service:

```js
const StandardError = require('@unplgtc/standard-error');
```

Expand StandardError with a custom error:

```js
StandardError.add({
	code: 'MyService_400',
	domain: 'MyService',
	title: 'Bad Request',
	message: 'Conise yet descriptive message explaining what probably went wrong if this error was emitted'
});
```

Expand StandardError with multiple custom errors at once:

```js
StandardError.add([
	{code: 'MyOtherService_401', domain: 'MyOtherService', title: 'Unauthorized', message: 'Unauthorized request passed to MyOtherService'},
	{code: 'MyOtherService_503', domain: 'MyOtherService', title: 'Service Unavailable', message: 'Attempted to contact upstream service but it was unavailable'}
]);
```

Return/throw/reject with StandardError objects during execution:

```js
// MyService.js

function returnOhNo(ohNo) {
	if (ohNo) {
		return StandardError.MyService_400;
	}
}

function rejectOhNo(ohNo) {
	if (ohNo) {
		return Promise.reject(StandardError.MyService_400);
	}
}

function throwOhNo(ohNo) {
	if (ohNo) {
		throw new Error(StandardError.MyService_400);
	}
}
```

StandardError works well with Unapologetic's [CBLogger package](https://github.com/unplgtc/cblogger) for improved error logging:

```js
const CBLogger = require('@unplgtc/cblogger');
const StandardError = require('@unplgtc/standard-error');

function logOhNos() {
	var ohNo = returnOhNo(true);
	if (ohNo === StandardError.MyService_400) {
		CBLogger.error('oh_no', {message: 'Another oh no occurred!'}, {stack: true}, StandardError.MyService_400);
	}
}
```

The above example would log something like the following:

```
ERROR: ** oh_no 
{ message: 'Another oh no occurred!' } 
** { code: 'MyService_400',
  domain: 'MyService',
  title: 'Bad Request',
  message: 'Conise yet descriptive message explaining what probably went wrong if this error was emitted' } 
-> MyService.js L11 at 2018-10-08 03:50:35.417Z (1538970635417) 
   at logOhNos (/Users/path/to/file/src/MyService.js:11:12)
    at Object.<anonymous> (/Users/path/to/file/src/MyService.js:21:1)
    at Module._compile (module.js:643:30)
    at Object.Module._extensions..js (module.js:654:10)
    at Module.load (module.js:556:32)
    at tryModuleLoad (module.js:499:12)
    at Function.Module._load (module.js:491:3)
```

## Accessing and removing values on the StandardError object

Show all errors:

```js
StandardError.show();
```

Output:

```js
{ '200': 
   { code: 200,
     domain: 'http',
     title: 'OK',
     message: 'Request successful' },
  '201': 
   { code: 201,
     domain: 'http',
     title: 'Created',
     message: 'Request successful, resource created' },
  '202': 
   { code: 202,
     domain: 'http',
     title: 'Accepted',
     message: 'The request has been accepted for processing' },
  [...],
  MyService_400: 
   { code: 'MyService_400',
     domain: 'MyService',
     title: 'Bad Request',
     message: 'Conise yet descriptive message explaining what probably went wrong if this error was emitted' },
  MyOtherService_401: 
   { code: 'MyOtherService_401',
     domain: 'MyOtherService',
     title: 'Unauthorized',
     message: 'Unauthorized request passed to MyOtherService' },
  MyOtherService_503: 
   { code: 'MyOtherService_503',
     domain: 'MyOtherService',
     title: 'Service Unavailable',
     message: 'Attempted to contact upstream service but it was unavailable' } }
```

Show all errors by domain:

```js
StandardError.show('MyService');
```

Output:

```js
{ MyService_400: 
   { code: 'MyService_400',
     domain: 'MyService',
     title: 'Bad Request',
     message: 'Conise yet descriptive message explaining what probably went wrong if this error was emitted' } }
```

List all error keys:

```js
StandardError.listKeys();
```

Output:

```js
[ '200',
  '201',
  '202',
  [...],
  'MyService_400',
  'MyOtherService_401',
  'MyOtherService_503' ]
```

List error keys by domain:

```js
StandardError.listKeys('MyOtherService');
```

Output:

```js
[ 'MyOtherService_401',
  'MyOtherService_503' ]
```

List all error objects:

```js
StandardError.listErrors();
```

Output

```js
[ { code: 200,
    domain: 'http',
    title: 'OK',
    message: 'Request successful' },
  { code: 201,
    domain: 'http',
    title: 'Created',
    message: 'Request successful, resource created' },
  { code: 202,
    domain: 'http',
    title: 'Accepted',
    message: 'The request has been accepted for processing' },
  [...],
  { code: 'MyService_400',
    domain: 'MyService',
    title: 'Bad Request',
    message: 'Conise yet descriptive message explaining what probably went wrong if this error was emitted' },
  { code: 'MyOtherService_401',
    domain: 'MyOtherService',
    title: 'Unauthorized',
    message: 'Unauthorized request passed to MyOtherService' },
  { code: 'MyOtherService_503',
    domain: 'MyOtherService',
    title: 'Service Unavailable',
    message: 'Attempted to contact upstream service but it was unavailable' } ]
```

List error objects by domain:

```js
StandardError.listErrors('MyOtherService');
```

Output:

```js
[ { code: 'MyOtherService_401',
    domain: 'MyOtherService',
    title: 'Unauthorized',
    message: 'Unauthorized request passed to MyOtherService' },
  { code: 'MyOtherService_503',
    domain: 'MyOtherService',
    title: 'Service Unavailable',
    message: 'Attempted to contact upstream service but it was unavailable' } ]
```

Remove errors from StandardError object:

```js
// Remove single error
StandardError.remove('MyService_400');

// Remove list of errors
StandardError.remove(['MyOtherService_401', 'MyOtherService_503']);
```

Remove full domain of errors from StandardError object:

```js
StandardError.removeByDomain('http');
```
