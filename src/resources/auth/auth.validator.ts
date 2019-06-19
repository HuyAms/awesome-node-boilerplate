import {body, param} from 'express-validator/check'
import {handleValidationError} from '../../middlewares/validator'
import {OathProvider} from '../user/user.interface'
import {enumToValues} from '../../utils/util'

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
		body('status', 'Not allow to set user status')
			.not()
			.exists(),
		body('role', 'Not allow to set user role')
			.not()
			.exists(),
		handleValidationError,
	]
}

export const validateSignIn = () => {
	return [
		body('email', 'Invalid email')
			.exists()
			.isEmail()
			.normalizeEmail(),
		body('password', 'Password must be at least 5 chars long').isLength({
			min: 5,
		}),
		handleValidationError,
	]
}

export const validateForgetPassword = () => {
	return [
		body('email', 'Invalid email')
			.exists()
			.isEmail()
			.normalizeEmail(),
		handleValidationError,
	]
}

export const validateResetPassword = () => {
	return [
		param('resetToken', 'Invalid token')
			.isString()
			.isLength({min: 10}),
		body('password', 'Password must be at least 5 chars long').isLength({
			min: 5,
		}),
		body(
			'passwordConfirmation',
			'Password confirmation should exist and has at least 5 chars long',
		).isLength({
			min: 5,
		}),
		body(
			'passwordConfirmation',
			'Password confirmation must match with new provided password',
		).custom((value, {req}) => {
			return value === req.body.password
		}),
		handleValidationError,
	]
}

export const validateActivateAccount = () => {
	return [
		param('resetToken', 'Invalid token')
			.isString()
			.isLength({min: 10}),
		handleValidationError,
	]
}

export const validateOathUnlink = () => {
	return [
		param('provider', 'Invalid Oath provider').isIn(enumToValues(OathProvider)),
		handleValidationError,
	]
}
