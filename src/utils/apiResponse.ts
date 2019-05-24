/**
 * Reponse handlers
 *
 */
import httpStatus from 'http-status'

/**
 * Send success response
 *
 * @param responseData: data that response sends to client
 * @param created: whether new data is created or modified
 * @param status: specific http status code that we want to send
 */
export const successResponse = (
	data: string | object,
	created?: boolean,
	status?: number,
) => {
	let responseData
	if (typeof data === 'string') {
		responseData = {message: data}
	} else {
		responseData = data
	}

	let responseStatus: number
	if (status) {
		responseStatus = status
	} else {
		responseStatus = created ? httpStatus.CREATED : httpStatus.OK
	}

	return {
		status: responseStatus,
		data: responseData,
	}
}

export default {
	successResponse,
}
