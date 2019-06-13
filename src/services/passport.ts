/**
 *
 * - Local strategy
 */

import passport from 'passport'
import localStrategy from 'passport-local'
import googleStrategy from 'passport-google-oauth'
import apiError, {ErrorCode} from '../utils/apiError'
import UserModel from '../resources/user/user.model'
import createLogger from '../utils/logger'
import config from '../config'
import {User, UserStatus} from '../resources/user/user.interface'

const logger = createLogger(module)

const LocalStrategy = localStrategy.Strategy
const GoogleStrategy = googleStrategy.OAuth2Strategy

const initPassport = () => {
	/**
	 * Sign in with email and password
	 */

	passport.use(
		new LocalStrategy(
			{
				usernameField: 'email',
			},
			async (email, password, done) => {
				try {
					// Check if provided email belongs to an user
					logger.debug(`Sign in with email: ${email}`)

					const user = await UserModel.findOne({email}).exec()
					if (!user) {
						return done(
							apiError.unauthorized(
								'Email is incorrect',
								ErrorCode.emailNotCorrect,
							),
							false,
						)
					}
					// Check if provided password matches with user's password
					if (user.checkPassword(password)) {
						return done(null, user)
					} else {
						return done(
							apiError.unauthorized(
								'Password is incorrect',
								ErrorCode.passwordNotCorrect,
							),
							false,
						)
					}
				} catch (error) {
					done(error)
				}
			},
		),
	)

	/**
	 * Sign in with Google
	 *
	 * User has signed in
	 *  - link user's account with Google if it has not been linked
	 * User has not signed in
	 *  - sign in user if google account has been used to sign up
	 * 	- sign up user if google account has not been used to sign up
	 */
	passport.use(
		new GoogleStrategy(
			{
				clientID: config.secrets.googleClientId,
				clientSecret: config.secrets.googleClientSecret,
				callbackURL: '/auth/google/callback',
				passReqToCallback: true,
			},
			async (req, accessToken, refreshToken, profile, done) => {
				const {
					id: googleId,
					name: {givenName, familyName},
					emails: [{value: gmail}],
				} = profile

				try {
					if (req.user) {
						// If google account has been linked, throw error
						const existingUser = await UserModel.findOne({
							googleId: profile.id,
						})
							.lean()
							.exec()

						if (existingUser) {
							return done(
								apiError.badRequest(
									'Google account has been linked',
									ErrorCode.googleAccountHasBeenLinked,
								),
								false,
							)
						}

						// Link google account
						const user = await UserModel.findById(req.user.id).exec()
						const {email, firstName, lastName} = user

						user.passport.googleId = googleId

						if (!email) {
							user.email = gmail
						}

						if (!firstName) {
							user.firstName = givenName
						}

						if (!lastName) {
							user.lastName = familyName
						}

						const savedUser = await user.save()
						return done(null, savedUser)
					} else {
						// If google account has been used to sign up, sign in user
						const existingUser = await UserModel.findOne({
							googleId: profile.id,
						})
							.lean()
							.exec()

						if (existingUser) {
							return done(null, existingUser)
						}

						// Create new Google account, if email has been used to sign up, throw error
						const existingEmailUser = await UserModel.findOne({
							email: profile.emails[0].value,
						})

						if (existingEmailUser) {
							return done(
								apiError.badRequest(
									'There is already an account using this Google email',
									ErrorCode.googleAccountHasBeenTaken,
								),
								false,
							)
						}

						const newUser: User = {
							firstName: givenName,
							lastName: familyName,
							email: gmail,
							passport: {googleId},
							status: UserStatus.Active,
						}

						const createdUser = await UserModel.create(newUser)

						return done(null, createdUser)
					}
				} catch (error) {
					done(error)
				}
			},
		),
	)
}

export default initPassport
