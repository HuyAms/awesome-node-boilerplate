import passport from 'passport'
import {RequestHandler} from 'express'
import {newToken} from '../../utils/auth'
import {successResponse} from '../../utils/apiResponse'
import createLogger from '../../utils/logger'
import * as services from './auth.service'

const logger = createLogger(module)

/**
 * Sign up new user
 *
 * @param req
 * @param res
 * @param next
 */
export const signup: RequestHandler = async (req, res, next) => {
	logger.debug('Sign up with: %o', req.body)

	try {
		const newUser = req.body

		const activateUserPath = `${req.headers.host}/auth/active`

		const token = await services.signup(newUser, activateUserPath)

		return res.json(successResponse(token))
	} catch (err) {
		return next(err)
	}
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
			return res.json(successResponse({token}))
		}
	})(req, res, next)
}

/**
 * Forget password
 * Save a reset password token and reset password expire to user model
 * Send user a link that has the reset password token
 *
 * @param req
 * @param res
 * @param next
 */
export const forgotPassword: RequestHandler = async (req, res, next) => {
	// Check if email that user submitted belongs to an user

	const {email} = req.body
	logger.debug(`Forgot password email: ${email}`)

	try {
		const resetUrlPath = `${req.headers.host}/auth/password/reset`
		const message = await services.forgotPassword(email, resetUrlPath)

		return res.json(successResponse(message, true))
	} catch (error) {
		return next(error)
	}
}

/**
 * Reset password
 * Verify reset password token from request param
 * Save new user password and clear reset password token & expire
 *
 * @param req
 * @param res
 * @param next
 */
export const resetPassword: RequestHandler = async (req, res, next) => {
	const {resetToken} = req.params
	const {password} = req.body

	try {
		const message = await services.resetPassword(resetToken, password)

		return res.json(successResponse(message, true))
	} catch (error) {
		return next(error)
	}
}

/**
 * Activate account
 *
 * Verify reset token from request param
 * Active user account and clear reset password token & expire
 *
 * @param req
 * @param res
 * @param next
 */
export const activateAccount: RequestHandler = async (req, res, next) => {
	const {resetToken} = req.params

	try {
		const message = await services.activateAccount(resetToken)

		return res.json(successResponse(message, true))
	} catch (error) {
		return next(error)
	}
}
