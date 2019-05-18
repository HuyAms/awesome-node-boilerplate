import passport from 'passport'
import {RequestHandler} from 'express'

import {newToken} from '../../utils/auth'
import {createUser} from '../../mockDB/db'
import apiError from '../../utils/apiError'
import createLogger from '../../utils/logger'

const logger = createLogger(module)

/**
 * Sign up new user
 */
export const signup: RequestHandler = (req, res, next) => {
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
export const signin: RequestHandler = (req, res, next) => {
	logger.debug('Sign in with: %o', req.body)
	passport.authenticate('local', (error, user) => {
		if (error) {
			return next(error)
		}

		// Missing credentials
		if (user) {
			const token = newToken(user)
			return res.status(200).send({token})
		}
	})(req, res, next)
}
