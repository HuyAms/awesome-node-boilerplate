import httpStatus from 'http-status'

export class ApiError extends Error {
	errorCode?: number
	status?: number

	constructor(message, status?, errorCode?) {
		super(message)
		this.status = status
		this.errorCode = errorCode
	}
}

/*errorCode 400*/
export const badRequestError = (message = 'Invalid params', errorCode = 0) => {
	return new ApiError(message, httpStatus.BAD_REQUEST, errorCode)
}

/*errorCode 401*/
export const unauthorizedError = (message = 'Unauthorize', errorCode = 0) => {
	return new ApiError(message, httpStatus.UNAUTHORIZED, errorCode)
}

/*errorCode 404*/
export const notFoundError = (message = 'Not found', errorCode = 0) => {
	return new ApiError(message, httpStatus.NOT_FOUND, errorCode)
}

/*errorCode 415*/
export const unsupportedMediaTypeError = (
	message = 'Invalid photo type',
	errorCode = 0,
) => {
	return new ApiError(message, httpStatus.UNSUPPORTED_MEDIA_TYPE, errorCode)
}

/*errorCode 500*/
export const internalServerError = (
	message = 'Unexpected database error',
	errorCode = 0,
) => {
	return new ApiError(message, httpStatus.INTERNAL_SERVER_ERROR, errorCode)
}

export default {
	badRequestError,
	unauthorizedError,
	notFoundError,
	unsupportedMediaTypeError,
	internalServerError,
}
