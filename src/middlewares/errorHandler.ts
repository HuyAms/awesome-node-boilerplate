import error, {ApiError} from '../utils/apiError'

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
		const apiError = error.internalServerError(err.message || err.msg)
		next(apiError)
	}

	next(err)
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

	res.status(status).json({
		status: status,
		errorCode: errorCode,
		message: message,
	})
}

const errorHandler = [parseError, sendError]

export default errorHandler
