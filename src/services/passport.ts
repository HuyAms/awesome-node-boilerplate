/**
 * Passport strategies configuration
 *
 * - Local strategy
 */

import passport from 'passport'
import * as localStrategy from 'passport-local'
import bcrypt from 'bcryptjs'
import {findById} from '../resources/user/user.service'
import apiError, {ErrorCode} from '../utils/apiError'

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
					const user = await findById(email)
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
					if (bcrypt.compareSync(password, user.password)) {
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
