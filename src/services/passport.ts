/**
 * Passport strategies configuration
 *
 * - Local strategy
 */

import passport from 'passport'
import * as localStrategy from 'passport-local'

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
		(email, password, done) => {
			// Return user for auth login controller
			const user = {email, password}
			return done(null, user)
		},
	),
)
