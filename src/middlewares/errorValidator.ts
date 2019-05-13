import {validationResult, ErrorFormatter} from 'express-validator/check'
import apiError from '../utils/apiError'

const errorFormatter: ErrorFormatter<String> = ({msg}) => {
	return msg
}

export const returnValidationError = (req, res, next) => {
	const errors = validationResult(req)

	if (!errors.isEmpty()) {
		const errorMessage = errors.formatWith(errorFormatter).array()[0] as string

		return next(apiError.badRequest(errorMessage))
	}

	next()
}
