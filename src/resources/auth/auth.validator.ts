/**
 * Validate sign up request
 *
 * @param req
 * @param res
 * @param next
 */
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
		return res.status(400).json({errors: errors})
	}

	next()
}

/**
 * Validate sign in request
 *
 * @param req
 * @param res
 * @param next
 */
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
		return res.status(400).json({errors: errors.array()})
	}

	next()
}
