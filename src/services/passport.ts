/**
 * Passport strategies configuration
 *
 * - Local strategy
 */

import passport from 'passport'
import * as localStrategy from 'passport-local'
import apiError, {ErrorCode} from '../utils/apiError'
import UserModel from '../resources/user/user.model'
import createLogger from '../utils/logger'

const logger = createLogger(module)

const LocalStrategy = localStrategy.Strategy

const initPassport = () => {
	/**
	 * Passport login local strategy
	 *
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
}

export default initPassport
