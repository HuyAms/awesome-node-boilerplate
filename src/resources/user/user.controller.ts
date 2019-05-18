import {RequestHandler, RequestParamHandler} from 'express'
import {findAllUser, findUserWithId} from '../../mockDB/db'

/**
 * Find user with req.params.id
 * - If found then attach user to req
 */
export const params: RequestParamHandler = (req, res, next, id) => {
	findUserWithId(Number(id))
		.then(user => (req.user = user))
		.catch(next)
}

/**
 * Get me
 */
export const getMe: RequestHandler = (req, res, next) => {
	res.status(200).json(req.user)
}

/**
 * Get users
 */
export const getMany: RequestHandler = (req, res, next) => {
	findAllUser()
		.then(users => res.status(200).json(users))
		.catch(next)
}

/**
 * Get user by id
 */
export const getOne: RequestHandler = (req, res) => {
	res.status(200).json(req.user)
}

/**
 * Update user with id
 */
export const updateOne: RequestHandler = (req, res) => {
	res.status(200).json(`UPDATE USER WITH ID ${req.params.id}`)
}

/**
 * Delete user with id
 */
export const deleteOne: RequestHandler = (req, res) => {
	res.status(200).json(`UPDATE USER WITH ID ${req.params.id}`)
}
