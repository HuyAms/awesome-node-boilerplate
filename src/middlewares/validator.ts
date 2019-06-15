import {RequestHandler} from 'express'
import {query, ErrorFormatter, validationResult} from 'express-validator/check'
import apiError from '../utils/apiError'

export enum Sort {
	asc = 'asc',
	desc = 'desc',
}

/**
 * Middleware to validate common queries
 */
export const validateCommonQueries = () => {
	return [
		query('sort', 'Invalid sort query')
			.optional()
			.isIn([Sort.asc, Sort.desc]),
		query('offset', 'Invalid pagination offset')
			.optional()
			.isNumeric()
			.custom(value => {
				return value >= 0
			}),
		query('limit', 'Invalid pagination limit')
			.optional()
			.isNumeric()
			.custom(value => {
				return value > 0
			}),
	]
}

/**
 * Middleware to return validation createError from express-validator
 *
 * @param req
 * @param res
 * @param next
 */
export const handleValidationError: RequestHandler = (req, res, next) => {
	const errors = validationResult(req)

	const errorFormatter: ErrorFormatter<string> = ({msg}) => {
		return msg
	}

	if (!errors.isEmpty()) {
		const errorMessage = errors.formatWith(errorFormatter).array()[0] as string

		return next(apiError.badRequest(errorMessage))
	}

	return next()
}
