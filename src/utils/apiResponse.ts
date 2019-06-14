/**
 * Reponse handlers
 *
 */
import httpStatus from 'http-status'
import {ApiError} from './apiError'
import config from '../config'

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
): SuccessResponse => {
	const responseData = typeof data === 'string' ? {message: data} : data

	let responseStatus = created ? httpStatus.CREATED : httpStatus.OK

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
