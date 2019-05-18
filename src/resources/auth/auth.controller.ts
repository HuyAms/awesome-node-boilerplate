import passport from 'passport'
import {RequestHandler} from 'express'

import {newToken} from '../../utils/auth'
import {createUser} from '../../mockDB/db'
import apiError from '../../utils/apiError'
import createLogger from '../../utils/logger'

const logger = createLogger(module)

/**
 * Sign up new user
 *
 * @param req
 * @param res
 * @param next
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
 *
 * @param req
 * @param res
 * @param next
 */
export const signin: RequestHandler = (req, res, next) => {
	logger.debug('Sign in with: %o', req.body)
	passport.authenticate('local', (error, user) => {
		if (error) {
			return next(error)
		}

		if (user) {
			const token = newToken(user)
			return res.json({token})
		}
	})(req, res, next)
}
