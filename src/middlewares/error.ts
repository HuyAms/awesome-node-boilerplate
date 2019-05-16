import {validationResult} from 'express-validator/check'
import {RequestHandler} from 'express'

export const returnValidationError: RequestHandler = (req, res, next) => {
	const errors = validationResult(req)

	if (!errors.isEmpty()) {
		return res.status(400).json({errors: errors.array()})
	}

	next()
}
