const statusCodes = {
	200: { title: 'OK', details: 'Request successful' },

	201: { title: 'Created', details: 'Request successful, resource created' },

	202: { title: 'Accepted', details: 'The request has been accepted for processing' },

	204: { title: 'No Content', details: 'Request successful, but no content returned' },

	400: { title: 'Bad Request', details: 'The server cannot or will not process the request' },

	401: { title: 'Unauthorized', details: 'Authentication required' },

	403: { title: 'Forbidden', details: 'Valid request, but the requested action is forbidden' },

	404: { title: 'Not Found', details: 'The requested resource could not be found' },

	405: { title: 'Method Not Allowed', details: 'The requested method is not supported for the requested resource' },

	406: { title: 'Not Acceptable', details: 'The requested resource is capable of generating only content not acceptable according to the Accept headers sent in the request' },

	407: { title: 'Proxy Authentication Required', details: 'The client must first authenticate itself with the proxy' },

	408: { title: 'Request Timeout', details: 'The client did not produce a request within the time that the server was prepared to wait' },

	409: { title: 'Conflict', details: 'The request could not be processed because of a conflict in the current state of the resource' },

	410: { title: 'Gone', details: 'The resource requested is no longer available and will not be available again' },

	418: { title: 'I\'m a Teapot', details: 'The requested entity body is short and stout' },

	429: { title: 'Too Many Request', details: 'Too many requests sent in a given amount of time' },

	500: { title: 'Internal Error', details: 'Unexpected condition was encountered' },

	501: { title: 'Not Implemented', details: 'Request method unsupported or unfulfillable' },

	502: { title: 'Bad Gateway', details: 'Invalid response received from upstream server' },

	503: { title: 'Service Unavailable', details: 'The server is currently unavailable' }
}

const HttpError = {
	name: 'HttpError',
	message: 'Request failed with status code ``statusCode`` (``title``)',
	properties: [ 'statusCode' ],
	extraProps: {
		statusCode: statusCodes
	}
};

export default HttpError;
