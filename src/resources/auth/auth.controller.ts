import passport from 'passport'

import {newToken} from '../../utils/auth'
import {createUser} from '../../mockDB/db'

/**
 * Sign up new user
 */
export const signup = (req, res, next) => {
	const {email, password} = req.body
	if (!email || !password) {
		return res.status(400).send({message: 'need email and password'})
	}

	createUser(req.body)
		.then(user => {
			const token = newToken(user)
			return res.status(201).send({token})
		})
		.catch(next)
}

/**
 * Sign in user
 */
export const signin = (req, res, next) => {
	passport.authenticate('local', (error, user, info) => {
		if (error) {
			return next(error)
		}
		// Missing credentials
		if (user) {
			const token = newToken(user)
			return res.status(200).send({token})
		}

		if (info) {
			return res.status(400).send(info)
		}
	})(req, res, next)
}
