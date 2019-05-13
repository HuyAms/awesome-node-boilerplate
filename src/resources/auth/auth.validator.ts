import {body} from 'express-validator/check'
import {returnValidationError} from '../../middlewares/errorValidator'

/**
 * Middleware to validate sign up request
 */
export const validateSignUp = () => {
	return [
		body('email', 'Invalid email')
			.isEmail()
			.normalizeEmail(),
		body('password', 'Password must be at least 5 chars long').isLength({
			min: 5,
		}),
		body('firstName', 'First name should not be empty').exists(),
		body('lastName', 'Last name should not be empty').exists(),
		returnValidationError,
	]
}

/**
 * Middleware to validate sign in request
 */
export const validateSignIn = () => {
	return [
		body('email', 'Invalid email')
			.exists()
			.isEmail()
			.normalizeEmail(),
		body('password', 'Password must be at least 5 chars long').isLength({
			min: 5,
		}),
		returnValidationError,
	]
}
