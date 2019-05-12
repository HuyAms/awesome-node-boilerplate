import httpStatus from 'http-status'
import ErrorCode from './errorCode'

/**
 * Api Error
 */
export class ApiError extends Error {
	errorCode?: ErrorCode
	status?: number

	constructor(message, status?, errorCode?) {
		super(message)
		this.status = status
		this.errorCode = errorCode
	}
}

/**
 *  Throw api error
 *
 * @param message
 * @param status
 * @param errorCode
 */
export const apiError = (message, status, errorCode?: ErrorCode) => {
	return new ApiError(message, status, errorCode)
}

/**
 * Throw Bad request (400)
 *
 * @param message
 * @param errorCode
 */
export const badRequest = (
	message = 'Invalid params',
	errorCode?: ErrorCode,
) => {
	return new ApiError(message, httpStatus.BAD_REQUEST, errorCode)
}

/**
 * Throw Unauthorized (401)
 *
 * @param message
 * @param errorCode
 */
export const unauthorized = (
	message = 'Unauthorized',
	errorCode?: ErrorCode,
) => {
	return new ApiError(message, httpStatus.UNAUTHORIZED, errorCode)
}

/**
 * Throw Not found (404)
 *
 * @param message
 * @param errorCode
 */
export const notFound = (message = 'Not found', errorCode?: ErrorCode) => {
	return new ApiError(message, httpStatus.NOT_FOUND, errorCode)
}

/**
 * Throw Unsupported media type (415)
 *
 * @param message
 * @param errorCode
 */
export const unsupportedMediaType = (
	message = 'Invalid photo type',
	errorCode?: ErrorCode,
) => {
	return new ApiError(message, httpStatus.UNSUPPORTED_MEDIA_TYPE, errorCode)
}

/**
 * Throw Internal server (500)
 *
 * @param message
 * @param errorCode
 */
export const internalServer = (
	message = 'Unexpected database error',
	errorCode?: ErrorCode,
) => {
	return new ApiError(message, httpStatus.INTERNAL_SERVER_ERROR, errorCode)
}

export default {
	apiError,
	badRequest,
	unauthorized,
	notFound,
	unsupportedMediaType,
	internalServer,
}
