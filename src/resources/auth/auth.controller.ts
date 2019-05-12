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
			let errorMessage
			if (info) {
				errorMessage = {
					...info,
					message: 'Email and password are required',
				}
			} else {
				errorMessage = {
					message: 'Email and password are required',
				}
			}
			res.status(400).send(errorMessage)
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
	const {email, password} = req.body
	if (!email || !password) {
		return res.status(400).send({message: 'need email and password'})
	}

	// Check password
	findUserWithEmail(email)
		.then(user => {
			if (user.password === password) {
				const token = newToken(user)
				return res.status(200).send({token})
			} else {
				return res.status(401).send({message: 'Fail to login'})
			}
		})
		.catch(next)
}
