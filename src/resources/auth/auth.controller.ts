import passport from 'passport'
import {passportLocal} from '../../services/passport'

import {newToken} from '../../utils/auth'
import {createUser, findUserWithEmail} from '../../mockDB/db'

/**
 * Sign up new user
 */
export const signup = (req, res, next) => {
	passport.authenticate(passportLocal.signup, (error, user, info) => {
		if (error) {
			return next(error)
		}

		// If credentials are missing
		if (!user) {
			info.message = 'Email and password are required'
			res.status(400).send(info)
		} else {
			createUser(user)
				.then(user => {
					const token = newToken(user)
					return res.status(201).send({token})
				})
				.catch(error => {
					return next(error)
				})
		}
	})(req, res, next)
}

/**
 * Sign in user
 */
export const signin = (req, res, next) => {
	passport.authenticate(passportLocal.login, (error, user, info) => {
		if (error) {
			console.log('Error', error)
			return next(error)
		}
		// Missing credentials
		if (!user) {
			info.message = 'Email and password are required'
			res.status(400).send(info)
		} else {
			const {email, password} = user
			findUserWithEmail(email)
				.then(user => {
					if (user.password === password) {
						const token = newToken(user)
						return res.status(200).send({token})
					} else {
						return res.status(401).send({message: 'Fail to login'})
					}
				})
				.catch(error => {
					return next(error)
				})
		}
	})(req, res, next)
}
