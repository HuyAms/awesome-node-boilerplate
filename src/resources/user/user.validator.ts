import {UserRole} from './user.model'

/**
 * Validate update user request
 *
 * @param req
 * @param res
 * @param next
 */
export const validateUpdateUser = (req, res, next) => {
	req
		.checkBody('email', 'Invalidi email')
		.isEmail()
		.normalizeEmail()
	req
		.checkBody('password', 'Password must be at least 5 chars long')
		.isLength({min: 5})
	req.checkBody('firstName', 'First name should not be empty').notEmpty()
	req.checkBody('lastName', 'Last name should not be empty').notEmpty()
	req.checkBody('role', 'Invalid role').isIn([UserRole.User, UserRole.Admin])

	const errors = req.validationErrors()

	if (errors) {
		return res.status(400).json({errors: errors})
	}

	next()
}
