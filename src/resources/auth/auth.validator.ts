import error from '../../utils/apiError'

export const validateSignUp = (req, res, next) => {
	req
		.checkBody('email', 'Invalidi email')
		.isEmail()
		.normalizeEmail()
	req
		.checkBody('password', 'Password must be at least 5 chars long')
		.isLength({min: 5})
	req.checkBody('firstName', 'First name should not be empty').notEmpty()
	req.checkBody('lastName', 'Last name should not be empty').notEmpty()

	const errors = req.validationErrors()

	if (errors) {
		next(error.badRequestError(errors[0].msg))
	}

	next()
}

export const validateSignIn = (req, res, next) => {
	req
		.checkBody('email', 'Invalidi email')
		.notEmpty()
		.isEmail()
		.normalizeEmail()
	req
		.checkBody('password', 'Password must be at least 5 chars long')
		.isLength({min: 5})

	const errors = req.validationErrors()

	if (errors) {
		next(error.badRequestError(errors[0].msg))
	}

	next()
}
