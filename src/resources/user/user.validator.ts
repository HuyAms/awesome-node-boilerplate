import {UserRole} from './user.model'
import {body} from 'express-validator/check'
import {returnValidationError} from '../../middlewares/error'

/**
 * Validate update user request
 */
export const validateUpdateUser = () => {
	return [
		body('email', 'Invalid email')
			.isEmail()
			.normalizeEmail(),
		body('password', 'Password must be at least 5 chars long').isLength({
			min: 5,
		}),
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
