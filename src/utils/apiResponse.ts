/**
 * Reponse handlers
 *
 */
import httpStatus from 'http-status'
import {ApiError} from './apiError'
import config from '../config'

/**
 * Check success status code
 *
 * @param status
 * @return {boolean} whether provided status code is valid as success status code
 */
const isSuccessStatus = (status: number) => {
	return 200 <= status && status <= 299
}

interface SuccessResponse {
	data: object
	status: number
}

/**
 * Send success response
 *
 * @param data: data that response sends to client
 * @param created: whether new data is created or modified
 * @param status: specific http status code that we want to send
 */
export const successResponse = (
	data: string | object,
	created?: boolean,
	status?: number,
): SuccessResponse => {
	const responseData = typeof data === 'string' ? {message: data} : data

	let responseStatus = created ? httpStatus.CREATED : httpStatus.OK

	if (status) {
		if (isSuccessStatus(status)) {
			responseStatus = status
		} else {
			throw new Error('Invalid success status')
		}
	}

	return {
		status: responseStatus,
		data: responseData,
	}
}

interface ErrorResponse {
	status: number
	errorCode: number
	message: string
	stack?: string
}

/**
 * Send error response
 *
 * @param error error object passed from error handler middleware
 */
export const errorResponse = (error: ApiError): ErrorResponse => {
	const {status, errorCode, message} = error

	// Only return error stack if env is develop and status is 500
	const stack =
		config.isDev && status === httpStatus.INTERNAL_SERVER_ERROR
			? error.stack
			: undefined

	return {
		status,
		errorCode,
		message,
		stack,
	}
}
