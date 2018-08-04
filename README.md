# StandardError

Expandable standardized error object for better logging and error handling in Node applications

StandardError comes equipped with a generic set of common HTTP errors, but can easily be expanded to support custom, application-specific errors using its `expand()` function. All expanded error values are verified to fit the expected format and to check for conflicts before being allowed onto the StandardError object.
