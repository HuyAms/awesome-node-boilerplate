/**
 * Passport strategies configuration
 *
 * - Local strategy
 */

import passport from 'passport'
import * as localStrategy from 'passport-local'
import {findUserWithEmail} from '../mockDB/db'

const LocalStrategy = localStrategy.Strategy

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
				const user = await findUserWithEmail(email)
				if (!user) {
					return done(null, null, {
						message: 'There is no email associated with this user',
					})
				}
				// Check if provided password matches with user's password
				if (user.password === password) {
					return done(null, user)
				} else {
					return done(null, null, {message: 'Password is incorrect'})
				}
			} catch (error) {
				done(error)
			}
		},
	),
)
