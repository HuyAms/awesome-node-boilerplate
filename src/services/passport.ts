/**
 * Passport strategies configuration
 *
 * - Local strategy
 */

import passport from 'passport'
import * as localStrategy from 'passport-local'

const LocalStrategy = localStrategy.Strategy

/**
 * Passport strategy name
 *
 */
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
	new LocalStrategy(
		{
			usernameField: 'email',
		},
		(email, password, done) => {
			// Return user for auth signup controller
			const user = {email, password}
			return done(null, user)
		},
	),
)

/**
 * Passport login local strategy
 *
 */
passport.use(
	passportLocal.login,
	new LocalStrategy(
		{
			usernameField: 'email',
		},
		(email, password, done) => {
			// Return user for auth login controller
			const user = {email, password}
			return done(null, user)
		},
	),
)
