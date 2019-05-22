import passport from 'passport'
import uuidv4 from 'uuid/v4'
import {RequestHandler} from 'express'

import {newToken} from '../../utils/auth'
import {
	createUser,
	findUserWithEmail,
	findUserWithToken,
	saveUser,
} from '../../mockDB/db'
import {Message, sendEmail} from '../../utils/mail'
import apiError, {ErrorCode} from '../../utils/apiError'
import createLogger from '../../utils/logger'
import config from '../../config'
import {UserSignUp} from './auth.interface'
import {User} from '../user/user.interface'

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

	const user: UserSignUp = req.body

	createUser(user)
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
	passport.authenticate('local', (error, user: User) => {
		if (error) {
			return next(error)
		}

		if (user) {
			const token = newToken(user)
			return res.json({token})
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
		const user = await findUserWithEmail(email)

		if (!user) {
			next(
				apiError.notFound(
					'Could not find an user with provided email',
					ErrorCode.emailNotFound,
				),
			)
			return
		}

		// Create reset password token
		const resetPasswordToken = uuidv4()
		const resetPasswordExp = Date.now() + 3600000 // 1 hour
		user.resetPasswordToken = resetPasswordToken
		user.resetPasswordExp = resetPasswordExp

		// Save user to the database
		await saveUser(user)

		// Send an email to user, containing the reset password token
		const resetUrl = `${req.headers.host}/auth/password/reset/${
			user.resetPasswordToken
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
		return res.json({message: 'Please check your email'})
	} catch (error) {
		next(error)
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
		logger.debug('Reset password of user: %o', user)

		if (!user) {
			next(
				apiError.notFound(
					'Cannot find user with provided token',
					ErrorCode.resetTokenInvalid,
				),
			)
		}

		// Check if expire time is over
		const resetPasswordExp = user.resetPasswordExp
		if (Date.now() > resetPasswordExp) {
			next(
				apiError.badRequest(
					'Token is already expired',
					ErrorCode.resetTokenInvalid,
				),
			)
		}

		// Check if user sends a password that is exact to be old one
		const {password} = req.body
		const oldPassword = user.password
		if (password === oldPassword) {
			next(apiError.badRequest('New password should not match with old one'))
		}

		// Save new user passsword
		// and remove reset token and expired time
		user.password = password
		user.resetPasswordExp = null
		user.resetPasswordToken = null
		await saveUser(user)

		// Send an email to notify user that password has been resetted
		const successMessage: Message = {
			from: config.mailSender,
			to: user.email,
			subject: 'You password has been reset',
			text: `This is a confirmation message for account ${
				user.email
			}. Your password has just been changed`,
		}

		await sendEmail(successMessage)

		return res
			.status(200)
			.send({message: 'Password has been successfully reset'})
	} catch (error) {
		next(apiError.notFound(error))
	}
}
