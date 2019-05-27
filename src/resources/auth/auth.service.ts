import {IUser, UserStatus} from '../user/user.interface'
import {generateResetToken} from '../../utils/util'
import {Message, sendEmail} from '../../services/mail'
import config from '../../config'
import {newToken} from '../../utils/auth'
import createLogger from '../../utils/logger'
import * as userServices from '../user/user.service'
import {Token} from './auth.interface'
import apiError, {ErrorCode} from '../../utils/apiError'
import bcrypt from 'bcryptjs'

const logger = createLogger(module)

export const signup = async (
	userCreate: IUser,
	host: string,
): Promise<Token> => {
	// Generate reset token
	const {resetToken, resetTokenExp} = generateResetToken()
	userCreate.resetToken = resetToken
	userCreate.resetTokenExp = resetTokenExp

	// Save user to the database
	const user = await userServices.create(userCreate)

	logger.debug('Save user: ', user.email)

	// Send an email to user, containing the activation link
	const activeUrl = `${host}/auth/active/${user.resetToken}`

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

	return {token}
}

export const forgotPassword = async (
	email: string,
	host: string,
): Promise<string> => {
	// Check if email that user submitted belongs to an user

	logger.debug(`Forgot password email: ${email}`)

	const user: IUser = await userServices.findOne({email})

	if (!user) {
		return Promise.reject(
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
	await userServices.update(user.id, user)

	// Send an email to user, containing the reset password token
	const resetUrl = `${host}/auth/password/reset/${user.resetToken}`

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

	return 'Please check your email'
}

export const resetPassword = async (
	resetToken: string,
	password: string,
): Promise<string> => {
	const user = await userServices.findOne({resetToken})

	if (!user) {
		Promise.reject(
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
		Promise.reject(
			apiError.badRequest(
				'Token is already expired',
				ErrorCode.resetTokenInvalid,
			),
		)
	}

	// Check if user sends a password that is exact to be old one
	const oldPassword = user.password
	if (bcrypt.compareSync(password, oldPassword)) {
		return Promise.reject(
			apiError.badRequest('New password should not match with old one'),
		)
	}

	// Save new user passsword
	// and remove reset token and expired time
	user.password = password
	user.resetTokenExp = null
	user.resetToken = null
	await userServices.update(user.id, user)

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

	return 'Password has been successfully rest'
}

export const activateAccount = async (resetToken: string) => {
	const user = await userServices.findOne({resetToken})

	if (!user) {
		return Promise.reject(
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
		return Promise.reject(
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
	await userServices.update(user.id, user)

	return 'Active user successfully'
}
