import {body, query} from 'express-validator/check'
import {handleValidationError} from '../../middlewares/validator'
import {UserRole} from './user.interface'
import {enumToValues} from '../../utils/util'

export const validateUpdateUser = () => {
	return [
		body('email', 'Not allow to update user email')
			.not()
			.exists(),
		body('password', 'Not allow to update user password')
			.not()
			.exists(),
		body('firstName', 'First name must be string at least 2 chars long')
			.optional()
			.isString()
			.isLength({min: 2}),
		body('lastName', 'Last name must be string at least 2 chars long')
			.optional()
			.isString()
			.isLength({min: 2}),
		body('role', 'Invalid role')
			.optional()
			.isIn(enumToValues(UserRole)),
		handleValidationError,
	]
}

export const validateUpdateMe = () => {
	return [
		body('email', 'Not allow to update user email')
			.not()
			.exists(),
		body('password', 'Not allow to update user password')
			.not()
			.exists(),
		body('role', 'Not allow to update user role')
			.not()
			.exists(),
		body('firstName', 'First name must be string at least 2 chars long')
			.optional()
			.isString()
			.isLength({min: 2}),
		body('lastName', 'Last name must be string at least 2 chars long')
			.optional()
			.isString()
			.isLength({min: 2}),
		handleValidationError,
	]
}

export const validateGetUsers = () => {
	return [
		query('field', 'Invalid field query')
			.optional()
			.isIn([
				'firstName',
				'lastName',
				'email',
				'role',
				'createdAt',
				'updatedAt',
			]),
		handleValidationError,
	]
}
