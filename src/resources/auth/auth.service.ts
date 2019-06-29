import {OathProvider, User, UserStatus} from '../user/user.interface'
import {generateResetToken} from '../../utils/util'
import {Message, sendEmail} from '../../services/mail'
import config from '../../config'
import {newToken} from '../../utils/auth'
import createLogger from '../../utils/logger'
import {Token} from './auth.interface'
import apiError, {ErrorCode} from '../../utils/apiError'
import UserModel, {UserDocument} from '../user/user.model'

const logger = createLogger(module)

/**
 * Sign up user
 *
 * @param newUser
 * @param activateUserPath
 */
export const signup = async (
	newUser: User,
	activateUserPath: string,
): Promise<Token> => {
	logger.debug('Sign up with: %o', newUser)

	// Check if email is unique
	const existingUser = await UserModel.findOne({email: newUser.email}).exec()

	if (existingUser) {
		return Promise.reject(
			apiError.badRequest(
				'Email has been already exits',
				ErrorCode.emailNotUnique,
			),
		)
	}

	// Generate reset token
	const {resetToken, resetTokenExp} = generateResetToken()
	newUser.passport.resetToken = resetToken
	newUser.passport.resetTokenExp = resetTokenExp

	// Save user to the database
	const user = await UserModel.create(newUser)

	// Send an email to user, containing the activation link
	const activateUserUrl = `${activateUserPath}/${user.passport.resetToken}`

	const message: Message = {
		from: config.mailSender,
		to: user.email,
		subject: 'Activate your account',
		html: `<p>To active your account, please click the following link:</p>
				<a href=${activateUserUrl}>${activateUserUrl}</a>`,
	}

	await sendEmail(message)

	logger.debug(`Send activation link to email: ${user.email}`)

	const token = newToken(user)

	return Promise.resolve({token})
}

/**
 * Forgot password
 *
 * @param email
 * @param resetUrlPath
 */
export const forgotPassword = async (
	email: string,
	resetUrlPath: string,
): Promise<void> => {
	// Check if email that user submitted belongs to an user

	logger.debug(`Forgot password email: ${email}`)

	const user = await UserModel.findOne({email}).exec()

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
	user.passport.resetToken = resetToken
	user.passport.resetTokenExp = resetTokenExp

	// Save user to the database
	await user.save()

	// Send an email to user, containing the reset password token
	const resetUrl = `${resetUrlPath}/${user.passport.resetToken}`

	const message: Message = {
		from: config.mailSender,
		to: user.email,
		subject: 'Reset password',
		html: `<p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.
					<br />
					Please click on the following link, or paste this into your browser to complete the process:</p>
					<a href=${resetUrl}>${resetUrl}</a>
					<p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`,
	}

	await sendEmail(message)

	logger.debug(`Send reset password link to email: ${user.email}`)

	return Promise.resolve()
}

/**
 * Reset password
 *
 * @param resetToken
 * @param password`
 */
export const resetPassword = async (
	resetToken: string,
	password: string,
): Promise<void> => {
	const user = await UserModel.findOne({resetToken})
		.where('resetTokenExp')
		.gt(Date.now())
		.exec()

	if (!user) {
		return Promise.reject(
			apiError.notFound('Invalid reset token', ErrorCode.resetTokenInvalid),
		)
	}

	logger.debug(`Reset password of user with email ${user.email}`)

	// Check if user sends a password that is exact to be old one
	if (user.checkPassword(password)) {
		return Promise.reject(
			apiError.badRequest('New password should not match with old one'),
		)
	}

	// Save new user passsword
	// and deleteOne reset token and expired time
	user.passport.password = password
	user.clearResetToken()
	await user.save()

	// Send an email to notify user that password has been reset
	const successMessage: Message = {
		from: config.mailSender,
		to: user.email,
		subject: 'You password has been reset',
		html: `<p>This is a confirmation message for account ${user.email}. <br />
			Your password has just been changed</p>`,
	}

	await sendEmail(successMessage)

	return Promise.resolve()
}

/**
 * Activate account
 *
 * @param resetToken
 */
export const activateAccount = async (
	resetToken: string,
): Promise<UserDocument> => {
	const user = await UserModel.findOne({'passport.resetToken': resetToken})
		.where('passport.resetTokenExp')
		.gt(Date.now())
		.exec()

	if (!user) {
		return Promise.reject(
			apiError.notFound(
				'Cannot find user with provided token',
				ErrorCode.resetTokenInvalid,
			),
		)
	}

	logger.debug(`Activate user with email ${user.email}`)

	// Activation user
	// and deleteOne reset token and expired time
	user.status = UserStatus.Active
	user.clearResetToken()

	return await user.save()
}

export const unLinkOath = async (
	userId: string,
	provider: OathProvider,
): Promise<UserDocument> => {
	const user = await UserModel.findById(userId)

	user.unlinkOathProvider(provider)

	logger.debug(`Unlink ${provider} from user with email ${user.email}`)

	return await user.save()
}
