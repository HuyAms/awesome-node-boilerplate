import crypto from 'crypto'
import passport from 'passport'

import {newToken} from '../../utils/auth'
import {
	createUser,
	findUserWithEmail,
	saveUser,
	findUserWithToken,
} from '../../mockDB/db'
import logger from '../../utils/logger'
import {sendEmail} from '../../utils/mail'

/**
 * Sign up new user
 */
export const signup = (req, res, next) => {
	logger.debug('Sign up with: %o', req.body)

	createUser(req.body)
		.then(user => {
			const token = newToken(user)
			return res.status(201).send({token})
		})
		.catch(next)
}

/**
 * Sign in user
 */
export const signin = (req, res, next) => {
	logger.debug('Sign in with: %o', req.body)
	passport.authenticate('local', (error, user, info) => {
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

/**
 * Forget password
 * Save a reset password token and reset password expire to user model
 * Send user a link that has the reset password token
 *
 */
export const forgetPassword = async (req, res, next) => {
	// Check if email that user submitted belongs to an user
	const {email} = req.body
	try {
		let user = await findUserWithEmail(email)
		if (!user) {
			return res
				.status(404)
				.send({message: 'Could not find an user with provided email'})
		}
		// Create reset password token
		const resetPasswordToken = crypto.randomBytes(20).toString('hex')
		// Set expired time to be 1 hour
		const resetPasswordExp = Date.now() + 3600000
		// Save them to user object
		user.resetPasswordToken = resetPasswordToken
		user.resetPasswordExp = resetPasswordExp
		// Save user to the database
		await saveUser(user)
		// Send an email to user, containing the reset password token
		const resetUrl = `${req.headers.host}/auth/password/reset/${
			user.resetPasswordToken
		}`

		const message = {
			from: process.env.MAIL_SENDER,
			to: user.email,
			subject: 'Reset password',
			text: `Please click this link to reset password ${resetUrl}`,
		}

		// Call back handler when email is successfully sent
		const callback = () => {
			res.status(201).send({message: 'Please check your email'})
		}

		// Error handler when email cannot be sent
		const errorHandler = error => {
			res.status(500).send(error)
		}
		sendEmail(message, callback, errorHandler)
	} catch (error) {
		next(error)
	}
}

/**
 * Reset password
 * Verify reset password token from request param
 * Save new user password and clear reset password token & expire
 *
 */
export const resetPassword = async (req, res, next) => {
	// Check if the token in req params match with an user in db
	const {resetToken} = req.params
	try {
		const user = await findUserWithToken(resetToken)
		logger.debug('User', user)
		if (!user) {
			return res
				.status(404)
				.send({message: 'Could not find an user with provided email'})
		}
		// Check if expire time is over
		const resetPasswordExp = user.resetPasswordExp
		if (Date.now() > resetPasswordExp) {
			return res.status(405).send({message: 'Token is already expired'})
		}

		// Save new user passsword
		// and remove reset token and expired time
		const {password} = req.body
		user.password = password
		user.resetPasswordExp = null
		user.resetPasswordToken = null
		await saveUser(user)

		return res
			.status(200)
			.send({message: 'Password has been successfully resetted'})
	} catch (error) {
		next(error)
	}
}
