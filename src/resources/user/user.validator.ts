import {body} from 'express-validator/check'
import {returnValidationError} from '../../middlewares/errorHandler'
import {UserRole} from './user.interface'

/**
 * Middleware to validate update user request
 */
export const validateUpdateUser = () => {
	return [
		body('email', 'Invalid email')
			.isEmail()
			.normalizeEmail(),
		body('password', 'Not allow to update user password')
			.not()
			.exists(),
		body('firstName', 'First name must be string at least 2 chars long')
			.isString()
			.isLength({min: 2}),
		body('lastName', 'Last name must be string at least 2 chars long')
			.isString()
			.isLength({min: 2}),
		body('role', 'Invalid role').isIn([UserRole.User, UserRole.Admin]),
		returnValidationError,
	]
}
