import {validationResult} from 'express-validator/check'

export const returnValidationError = (req, res, next) => {
	const errors = validationResult(req)

	if (!errors.isEmpty()) {
		return res.status(400).json({errors: errors.array()})
	}

	next()
}
