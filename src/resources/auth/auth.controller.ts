import passport from 'passport'
import {RequestHandler} from 'express'
import bcrypt from 'bcryptjs'

import {newToken} from '../../services/auth'
import {
	createUser,
	findUserWithEmail,
	findUserWithToken,
	saveUser,
} from '../../mockDB/db'
import {Message, sendEmail} from '../../services/mail'
import apiError, {ErrorCode} from '../../utils/apiError'
import {successResponse} from '../../utils/apiResponse'
import createLogger from '../../utils/logger'
import config from '../../config'
import {UserModel, UserStatus} from '../user/user.model'
import {generateResetToken} from '../../utils/util'

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

	const newUser = req.body

	try {
		const user = await createUser(newUser)

		// Generate reset token
		const {resetToken, resetTokenExp} = generateResetToken()
		user.resetToken = resetToken
		user.resetTokenExp = resetTokenExp

		// Save user to the database
		await saveUser(user)

		logger.debug('Save user: ', user.email)

		// Send an email to user, containing the activation link
		const activeUrl = `${req.headers.host}/auth/active/${user.resetToken}`

		const message: Message = {
			from: config.mailSender,
			to: user.email,
			subject: 'Activate your account',
			text: `To active your account, please click the following link: \n \n
				${activeUrl}
			`,
		}

		await sendEmail(message)

		logger.debug('Send reset password link to email: ', user.email)

		const token = newToken(user)
		return res.json(successResponse({token}))
	} catch (err) {
		return next(apiError.internalServer(err.message))
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
	passport.authenticate('local', (error, user: UserModel) => {
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
		const user: UserModel = await findUserWithEmail(email)

		if (!user) {
			return next(
				apiError.notFound(
					'Could not find an user with provided email',
					ErrorCode.emailNotFound,
				),
			)
		}

		// Generate reset token
		const {resetToken, resetTokenExp} = generateResetToken()
		user.resetToken = resetToken
		user.resetTokenExp = resetTokenExp

		// Save user to the database
		await saveUser(user)

		// Send an email to user, containing the reset password token
		const resetUrl = `${req.headers.host}/auth/password/reset/${
			user.resetToken
		}`

		const message: Message = {
			from: config.mailSender,
			to: user.email,
			subject: 'Reset password',
			text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste this into your browser to complete the process:\n\n
          ${resetUrl}
          If you did not request this, please ignore this email and your password will remain unchanged.\n`,
		}

		await sendEmail(message)

		logger.debug('Send reset password link to email: ', user.email)

		return res.json(successResponse('Please check your email', true))
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
	// Check if the token in req params match with an user in db
	const {resetToken} = req.params

	try {
		const user = await findUserWithToken(resetToken)

		if (!user) {
			return next(
				apiError.notFound(
					'Cannot find user with provided token',
					ErrorCode.resetTokenInvalid,
				),
			)
		}

		logger.debug('Reset password of user: %o', user)

		// Check if expire time is over
		const {resetTokenExp} = user
		if (Date.now() > resetTokenExp) {
			return next(
				apiError.badRequest(
					'Token is already expired',
					ErrorCode.resetTokenInvalid,
				),
			)
		}

		// Check if user sends a password that is exact to be old one
		const {password} = req.body
		const oldPassword = user.password
		if (bcrypt.compareSync(password, oldPassword)) {
			return next(
				apiError.badRequest('New password should not match with old one'),
			)
		}

		// Save new user passsword
		// and remove reset token and expired time
		user.password = password
		user.resetTokenExp = null
		user.resetToken = null
		await saveUser(user)

		// Send an email to notify user that password has been reset
		const successMessage: Message = {
			from: config.mailSender,
			to: user.email,
			subject: 'You password has been reset',
			text: `This is a confirmation message for account ${
				user.email
			}. Your password has just been changed`,
		}

		await sendEmail(successMessage)

		return res.json(
			successResponse('Password has been successfully rest', true),
		)
	} catch (error) {
		return next(apiError.notFound(error))
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
	// Check if the token in req params match with an user in db
	const {resetToken} = req.params

	try {
		const user = await findUserWithToken(resetToken)

		if (!user) {
			return next(
				apiError.notFound(
					'Cannot find user with provided token',
					ErrorCode.resetTokenInvalid,
				),
			)
		}

		logger.debug(`Activation user with email ${user.email}`)

		// Check if expire time is over
		const {resetTokenExp} = user
		if (Date.now() > resetTokenExp) {
			return next(
				apiError.badRequest(
					'Token is already expired',
					ErrorCode.resetTokenInvalid,
				),
			)
		}

		// Activation user
		// and remove reset token and expired time
		user.status = UserStatus.Active
		user.resetTokenExp = null
		user.resetToken = null
		await saveUser(user)

		return res.json(
			successResponse({message: 'Active user successfully'}, true),
		)
	} catch (error) {
		return next(apiError.notFound(error))
	}
}
