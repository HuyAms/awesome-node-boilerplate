import {RequestHandler, RequestParamHandler} from 'express'
import {findAllUser, findUserWithId} from '../../mockDB/db'
import apiError from '../../utils/apiError'

/**
 * Find user with req.params.id
 * - If found then attach user to req
 */
export const params: RequestParamHandler = (req, res, next, id) => {
	findUserWithId(Number(id))
		.then(user => (req.user = user))
		.catch(error => next(apiError.badRequest(error)))
}

/**
 * Get me
 */
export const getMe: RequestHandler = (req, res, next) => {
	return res.json(req.user)
}

/**
 * Get users
 */
export const getMany: RequestHandler = (req, res, next) => {
	findAllUser()
		.then(users => res.json(users))
		.catch(error => next(apiError.badRequest(error)))
}

/**
 * Get user by id
 */
export const getOne: RequestHandler = (req, res, next) => {
	return res.json(req.user)
}

/**
 * Update user with id
 */
export const updateOne: RequestHandler = (req, res) => {
	return res.json(`UPDATE USER WITH ID ${req.params.id}`)
}

/**
 * Delete user with id
 */
export const deleteOne: RequestHandler = (req, res) => {
	return res.json(`UPDATE USER WITH ID ${req.params.id}`)
}
