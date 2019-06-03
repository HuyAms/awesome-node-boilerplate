import passport from 'passport'
import {RequestHandler} from 'express'
import {newToken} from '../../utils/auth'
import {successResponse} from '../../utils/apiResponse'
import * as services from './auth.service'
import {UserDocument} from '../user/user.model'

/**
 * Sign up new user
 *
 * @param req
 * @param res
 * @param next
 */
export const signup: RequestHandler = async (req, res, next) => {
	try {
		const newUser = req.body

		const activateUserPath = `${req.protocol}://${req.hostname}/auth/active`

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
	passport.authenticate('local', (error: Error, user: UserDocument) => {
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

	try {
		const resetUrlPath = `${req.protocol}://${req.hostname}/auth/reset`
		await services.forgotPassword(email, resetUrlPath)

		const message = 'Please check your email'

		return res.json(successResponse(message, true))
	} catch (error) {
		return next(error)
	}
}

/**
 * @param req
 * @param res
 * @param next
 */
export const getForgotPassword: RequestHandler = (req, res, next) => {
	res.render('auth/forgot', {
		title: 'Forgot password',
	})
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
		await services.resetPassword(resetToken, password)

		const message = 'Password has been successfully rest'

		return res.json(successResponse(message, true))
	} catch (error) {
		return next(error)
	}
}

/**
 * @param req
 * @param res
 * @param next
 */
export const getResetPassword: RequestHandler = (req, res, next) => {
	res.render('auth/reset', {
		title: 'Password Reset',
	})
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
		await services.activateAccount(resetToken)

		const message = 'Active user successfully'

		return res.json(successResponse(message, true))
	} catch (error) {
		return next(error)
	}
}
