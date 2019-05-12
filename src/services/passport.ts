/**
 * Passport strategies configuration
 *
 * - Local strategy
 */

import passport from 'passport'
import * as passportStrategy from 'passport-local'

export enum passportLocal {
	signup = 'signup',
	login = 'login',
}

/**
 * Passport signup local strategy
 *
 */
passport.use(
	passportLocal.signup,
	new passportStrategy.Strategy(
		{
			usernameField: 'email',
		},
		(email, password, done) => {
			// Return user for controller to handle
			const user = {email, password}
			return done(null, user)
		},
	),
)
