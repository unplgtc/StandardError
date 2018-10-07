'use strict';

const HttpCodes = {
	200: {code: 200, domain: 'http', title: 'OK', message: 'Request successful'},

	201: {code: 201, domain: 'http', title: 'Created', message: 'Request successful, resource created'},

	202: {code: 202, domain: 'http', title: 'Accepted', message: 'The request has been accepted for processing'},

	204: {code: 204, domain: 'http', title: 'No Content', message: 'Request successful, but no content returned'},

	400: {code: 400, domain: 'http', title: 'Bad Request', message: 'The server cannot or will not process the request'},

	401: {code: 401, domain: 'http', title: 'Unauthorized', message: 'Authentication required'},

	403: {code: 403, domain: 'http', title: 'Forbidden', message: 'Valid request, but the requested action is forbidden'},

	404: {code: 404, domain: 'http', title: 'Not Found', message: 'The requested resource could not be found'},

	405: {code: 405, domain: 'http', title: 'Method Not Allowed', message: 'The requested method is not supported for the requested resource'},

	406: {code: 406, domain: 'http', title: 'Not Acceptable', message: 'The requested resource is capable of generating only content not acceptable according to the Accept headers sent in the request'},

	407: {code: 407, domain: 'http', title: 'Proxy Authentication Required', message: 'The client must first authenticate itself with the proxy'},

	408: {code: 408, domain: 'http', title: 'Request Timeout', message: 'The client did not produce a request within the time that the server was prepared to wait'},

	409: {code: 409, domain: 'http', title: 'Conflict', message: 'The request could not be processed because of a conflict in the current state of the resource'},

	410: {code: 410, domain: 'http', title: 'Gone', message: 'The resource requested is no longer available and will not be available again'},

	418: {code: 418, domain: 'http', title: 'I\'m a Teapot', message: 'The requested entity body is short and stout'},

	429: {code: 429, domain: 'http', title: 'Too Many Request', message: 'Too many requests sent in a given amount of time'},

	500: {code: 500, domain: 'http', title: 'Internal Error', message: 'Unexpected condition was encountered'},

	501: {code: 501, domain: 'http', title: 'Not Implemented', message: 'Request method unsupported or unfulfillable'},

	502: {code: 502, domain: 'http', title: 'Bad Gateway', message: 'Invalid response received from upstream server'},

	503: {code: 503, domain: 'http', title: 'Service Unavailable', message: 'The server is currently unavailable'}
}

module.exports = HttpCodes;
