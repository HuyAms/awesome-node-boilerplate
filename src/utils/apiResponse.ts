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
	data: any,
	created?: Boolean,
	status?: number,
) => {
	let responseStatus: Number
	if (status) {
		responseStatus = status
	} else {
		responseStatus = created ? httpStatus.CREATED : httpStatus.OK
	}

	return {
		status: responseStatus,
		data,
	}
}

export default {
	successResponse,
}
