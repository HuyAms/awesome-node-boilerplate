import passport from 'passport'
import {RequestHandler} from 'express'
import {newToken} from '../../utils/auth'
import {successResponse} from '../../utils/apiResponse'
import * as services from './auth.service'
import {UserDocument} from '../user/user.model'
import config from '../../config'
import {User} from '../user/user.interface'

/**
 * Sign up new user
 *
 * @param req
 * @param res
 * @param next
 */
export const signup: RequestHandler = async (req, res, next) => {
	const {firstName, lastName, email, password} = req.body

	const newUser: User = {
		firstName,
		lastName,
		email,
		passport: {
			password,
		},
	}

	const host =
		config.clientHost || config.isDev
			? `${req.protocol}://${req.hostname}:${config.port}`
			: `${req.protocol}://${req.hostname}`

	const activateUserPath = `${host}/auth/active`

	try {
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
 * Handle callback if success Google authentication
 *
 * @param req
 * @param res
 * @param next
 */
export const handleGoogleCallback: RequestHandler = (req, res, next) => {
	const {user} = req
	const token = newToken(user)
	return res.json(successResponse({token}))
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

	const host =
		config.clientHost || config.isDev
			? `${req.protocol}://${req.hostname}:${config.port}`
			: `${req.protocol}://${req.hostname}`

	const resetUrlPath = `${host}/auth/password/reset`

	try {
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
	return res.render('auth/forgot', {
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
	return res.render('auth/reset', {
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
export const getActivateAccount: RequestHandler = async (req, res, next) => {
	const {resetToken} = req.params

	try {
		await services.activateAccount(resetToken)

		return res.render('auth/activate', {
			message: 'Activate user successfully',
		})
	} catch (error) {
		return next(error)
	}
}

export const getOathUnLink: RequestHandler = async (req, res, next) => {
	const {provider} = req.params
	const {id} = req.user

	try {
		await services.unLinkOath(id, provider)

		const message = `Unlink ${provider} successfully`

		return res.json(successResponse(message, true))
	} catch (error) {
		return next(error)
	}
}
