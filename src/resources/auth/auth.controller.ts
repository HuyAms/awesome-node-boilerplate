import {newToken} from '../../utils/auth'
import {createUser, findUserWithEmail} from '../../mockDB/db'
import logger from '../../utils/logger'

/**
 * Sign up new user
 */
export const signup = (req, res, next) => {
	logger.debug('Sign up with: %o', req.body)

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
	logger.debug('Sign in with: %o', req.body)

	const {email, password} = req.body

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
