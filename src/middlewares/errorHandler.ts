import error, {ApiError} from '../utils/apiError'
import httpStatus from 'http-status'
import logger from '../utils/logger'

/**
 * Middleware to parse Error
 *
 * @param err
 * @param req
 * @param res
 * @param next
 */
const parseError = (err, req, res, next) => {
	if (!(err instanceof ApiError)) {
		const apiError = error.internalServer(err.message || err.msg)
		return next(apiError)
	}

	return next(err)
}

/**
 * Middleware to send Error
 *
 * @param err
 * @param req
 * @param res
 * @param next
 */
const sendError = (err, req, res, next) => {
	const {errorCode, message, status} = err

	if (status === httpStatus.INTERNAL_SERVER_ERROR) {
		logger.error(err)
	} else {
		logger.debug(`[ERROR]: ${message}`)
	}

	res.status(status).json({
		status: status,
		errorCode: errorCode,
		message: message,
	})
}

const errorHandler = [parseError, sendError]

export default errorHandler
