import {body} from 'express-validator/check'
import {returnValidationError} from '../../middlewares/errorValidator'
import {UserRole} from './user.model'

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
		body('firstName', 'First name should not be empty').exists(),
		body('lastName', 'Last name should not be empty').isEmail(),
		body('role', 'Invalid role').isIn([UserRole.User, UserRole.Admin]),
		returnValidationError,
	]
}
