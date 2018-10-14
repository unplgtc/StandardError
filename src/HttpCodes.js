'use strict';

const HttpCodes = [
	{code: 'http_200', domain: 'http', title: 'OK', message: 'Request successful'},

	{code: 'http_201', domain: 'http', title: 'Created', message: 'Request successful, resource created'},

	{code: 'http_202', domain: 'http', title: 'Accepted', message: 'The request has been accepted for processing'},

	{code: 'http_204', domain: 'http', title: 'No Content', message: 'Request successful, but no content returned'},

	{code: 'http_400', domain: 'http', title: 'Bad Request', message: 'The server cannot or will not process the request'},

	{code: 'http_401', domain: 'http', title: 'Unauthorized', message: 'Authentication required'},

	{code: 'http_403', domain: 'http', title: 'Forbidden', message: 'Valid request, but the requested action is forbidden'},

	{code: 'http_404', domain: 'http', title: 'Not Found', message: 'The requested resource could not be found'},

	{code: 'http_405', domain: 'http', title: 'Method Not Allowed', message: 'The requested method is not supported for the requested resource'},

	{code: 'http_406', domain: 'http', title: 'Not Acceptable', message: 'The requested resource is capable of generating only content not acceptable according to the Accept headers sent in the request'},

	{code: 'http_407', domain: 'http', title: 'Proxy Authentication Required', message: 'The client must first authenticate itself with the proxy'},

	{code: 'http_408', domain: 'http', title: 'Request Timeout', message: 'The client did not produce a request within the time that the server was prepared to wait'},

	{code: 'http_409', domain: 'http', title: 'Conflict', message: 'The request could not be processed because of a conflict in the current state of the resource'},

	{code: 'http_410', domain: 'http', title: 'Gone', message: 'The resource requested is no longer available and will not be available again'},

	{code: 'http_418', domain: 'http', title: 'I\'m a Teapot', message: 'The requested entity body is short and stout'},

	{code: 'http_429', domain: 'http', title: 'Too Many Request', message: 'Too many requests sent in a given amount of time'},

	{code: 'http_500', domain: 'http', title: 'Internal Error', message: 'Unexpected condition was encountered'},

	{code: 'http_501', domain: 'http', title: 'Not Implemented', message: 'Request method unsupported or unfulfillable'},

	{code: 'http_502', domain: 'http', title: 'Bad Gateway', message: 'Invalid response received from upstream server'},

	{code: 'http_503', domain: 'http', title: 'Service Unavailable', message: 'The server is currently unavailable'}
];

module.exports = HttpCodes;
