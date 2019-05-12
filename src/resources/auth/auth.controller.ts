import {newToken} from '../../utils/auth'
import {createUser, findUserWithEmail} from '../../mockDB/db'
import logger from '../../utils/logger'
import apiError from '../../utils/apiError'

/**
 * Sign up new user
 */
export const signup = (req, res, next) => {
	logger.debug('Sign up with: %o', req.body)

	createUser(req.body)
		.then(user => {
			const token = newToken(user)
			res.json({token})
		})
		.catch(err => next(apiError.badRequestError(err.message)))
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
				res.json({token})
			} else {
				next(apiError.unauthorizedError('Fail to login'))
			}
		})
		.catch(err => next(apiError.badRequestError(err.message)))
}
