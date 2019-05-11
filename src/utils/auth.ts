import jwt from 'jsonwebtoken'
import {config} from '../config/config'
import UserModel from '../resources/user/user.model'

export const newToken = (user: UserModel) => {
	const {secret} = config

	return jwt.sign({id: user.id}, secret.jwt, {
		expiresIn: secret.jwtExp,
	})
}

export const verifyToken = token =>
	new Promise((resolve, reject) => {
		jwt.verify(token, config.secret.jwt, (err, payload) => {
			if (err) {
				return reject(err)
			}
			resolve(payload)
		})
	})

export const getTokenFromHeader = req => {
	let formattedToken: string

	// If found token in query then place it in the header

	if (req.query && req.query.hasOwnProperty('token')) {
		formattedToken = 'Bearer ' + req.query.token
		req.headers.authorization = formattedToken
	}

	const authorization = req.headers.authorization

	if (authorization && authorization.split(' ')[0] === 'Bearer') {
		return req.headers.authorization.split(' ')[1].trim()
	}

	return null
}
