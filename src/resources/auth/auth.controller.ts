import {newToken} from '../../utils/auth'
import {createUser, findUserWithEmail} from '../../mockDB/db'
import logger from '../../utils/logger'
import apiError from '../../utils/apiError'
import ErrorCode from '../../utils/ErrorCode'

/**
 * Sign up new user
 */
export const signup = (req, res, next) => {
	logger.debug('Sign up with: %o', req.body)

	createUser(req.body)
		.then(user => {
			const token = newToken(user)
			return res.json({token})
		})
		.catch(err => next(apiError.badRequest(err.message)))
}

/**
 * Sign in user
 */
export const signin = (req, res, next) => {
	logger.debug('Sign in with: %o', req.body)

	const {email, password} = req.body

	// Check password
	findUserWithEmail(email)
		.then(user => {
			if (user.password === password) {
				const token = newToken(user)
				return res.json({token})
			} else {
				return next(
					apiError.unauthorized(
						'Password is not correct',
						ErrorCode.passwordNotCorrect,
					),
				)
			}
		})
		.catch(err =>
			next(
				apiError.unauthorized(
					'Email is not correct',
					ErrorCode.emailNotCorrect,
				),
			),
		)
}
