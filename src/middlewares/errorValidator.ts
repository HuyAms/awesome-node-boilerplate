import {validationResult, ErrorFormatter} from 'express-validator/check'
import apiError from '../utils/apiError'

/**
 * Express-validator error formatter
 * @param msg
 */
const errorFormatter: ErrorFormatter<String> = ({msg}) => {
	return msg
}

/**
 * Middleware to return validation error from express-validator
 *
 * @param req
 * @param res
 * @param next
 */
export const returnValidationError = (req, res, next) => {
	const errors = validationResult(req)

	if (!errors.isEmpty()) {
		const errorMessage = errors.formatWith(errorFormatter).array()[0] as string

		return next(apiError.badRequest(errorMessage))
	}

	next()
}
