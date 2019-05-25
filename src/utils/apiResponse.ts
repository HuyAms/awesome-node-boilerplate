/**
 * Reponse handlers
 *
 */
import httpStatus from 'http-status'

/**
 * Validate status code
 *
 * @param status
 * @return {boolean} whether status code is valid
 */
const validateStatus = (status: number) => {
	return 200 <= status && status <= 299
}

/**
 * Send success response
 *
 * @param data: data that response sends to client
 * @param created: whether new data is created or modified
 * @param status: specific http status code that we want to send
 */
interface SuccessResponse {
	data: object
	status: number
}

export const successResponse = (
	data: string | object,
	created?: boolean,
	status?: number,
): SuccessResponse => {
	let responseData
	if (typeof data === 'string') {
		responseData = {message: data}
	} else {
		responseData = data
	}

	let responseStatus: number
	if (status) {
		if (validateStatus(status)) {
			responseStatus = status
		} else {
			throw new Error('Invalid success status')
		}
	} else {
		responseStatus = created ? httpStatus.CREATED : httpStatus.OK
	}

	return {
		status: responseStatus,
		data: responseData,
	}
}

/**
 * Send error response
 *
 * @param error error object passed from error handler middleware
 */
interface ErrorResponse {
	status: number
	errorCode: number
	message: string
}

export const errorResponse = (error: ErrorResponse) => {
	const err = {
		status: error.status,
		errorCode: error.errorCode,
		message: error.message,
	}

	return err
}
