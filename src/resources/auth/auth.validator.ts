import {body, param} from 'express-validator/check'
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
		body('firstName', 'First name must be string and at least 2 chars long')
			.isString()
			.isLength({min: 2}),
		body('lastName', 'Last name must be string at least 2 chars long')
			.isString()
			.isLength({min: 2}),
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

/**
 * Middleware to validate forget password reset
 *
 */
export const validateForgetPassword = () => {
	return [
		body('email', 'Invalid email')
			.exists()
			.isEmail()
			.normalizeEmail(),
		returnValidationError,
	]
}

/**
 * Middleware to valide reset password token
 *
 */
export const validateResetPassword = () => {
	return [
		param('resetToken', 'Invalid token')
			.isString()
			.isLength({min: 10}),
		returnValidationError,
	]
}
