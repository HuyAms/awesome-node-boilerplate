import {ErrorRequestHandler} from 'express'
import chalk from 'chalk'
import {ApiError} from '../utils/apiError'
import httpStatus from 'http-status'
import createLogger from '../utils/logger'
import {errorResponse} from '../utils/apiResponse'

const logger = createLogger(module)

/**
 * Middleware to parse Error
 *
 * @param err
 * @param req
 * @param res
 * @param next
 */
const parseError: ErrorRequestHandler = (err, req, res, next) => {
	if (!(err instanceof ApiError)) {
		const apiError = new ApiError(
			err.message || err.msg,
			err.status || httpStatus.INTERNAL_SERVER_ERROR,
		)
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
const sendError: ErrorRequestHandler = (err, req, res, next) => {
	const {status, message} = err

	if (status === httpStatus.INTERNAL_SERVER_ERROR) {
		logger.error(err)
	} else {
		logger.debug(`${chalk.red('[ERROR]:')} ${message}`)
	}

	res.status(status).json(errorResponse(err))
}

export const errorHandler = [parseError, sendError]
