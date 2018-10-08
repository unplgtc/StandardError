[![CircleCI master build status](https://img.shields.io/circleci/project/github/unplgtc/StandardError/master.svg?label=master&logo=circleci)](https://circleci.com/gh/unplgtc/StandardError/tree/master)
[![npm version](https://img.shields.io/npm/v/@unplgtc/standard-error.svg)](https://www.npmjs.com/package/@unplgtc/standard-error)

# StandardError

### Expandable standardized error object for improved logging and error handling in Node applications.

StandardError empowers services to explicitly define and register a set of their own domain-specific error objects. During execution services can then return, reject, or throw with these errors, resulting in an injection of clearly identifiable and traceable errors throughout your application.

StandardError comes equipped with a generic set of common HTTP errors, but can easily be expanded to support custom, domain-specific errors using its `add()` function. All custom errors are verified to fit the expected format and to check for conflicts before being allowed onto the StandardError object.

## Usage

Import StandardError into a service:

```
const StandardError = require('@unplgtc/standard-error');
```

Expand StandardError with custom errors:

```
StandardError.add([
	{code: 'MyService_400', domain: 'MyService', title: 'Bad Request', message: 'Conise yet descriptive message explaining what probably went wrong if this error was emitted'}
]);
```

Return/throw/reject with StandardError objects during execution:

```
// MyService.js

function returnError(ohNo) {
	if (ohNo) {
		return StandardError.MyService_400;
	}
}

function rejectWithError(ohNo) {
	if (ohNo) {
		return Promise.reject(StandardError.MyService_400);
	}
}

function throwError(ohNo) {
	if (ohNo) {
		throw new Error(StandardError.MyService_400);
	}
}
```

StandardError works well with Unapologetic's [CBLogger package](https://github.com/unplgtc/cblogger) for improved error logging:

```
const CBLogger = require('@unplgtc/cblogger');
const StandardError = require('@unplgtc/standard-error');

function logOhNos() {
	var ohNo = returnError(true);
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
