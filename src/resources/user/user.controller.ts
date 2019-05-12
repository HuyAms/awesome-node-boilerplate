import {findAllUser, findUserWithId} from '../../mockDB/db'
import apiError from '../../utils/apiError'

/**
 * Find user with req.params.id
 * - If found then attach user to req
 */
export const params = (req, res, next, id) => {
	findUserWithId(Number(id))
		.then(user => (req.user = user))
		.catch(error => next(apiError.badRequestError(error)))
}

/**
 * Get me
 */
export const getMe = (req, res, next) => {
	res.json(req.user)
}

/**
 * Get users
 */
export const getMany = (req, res, next) => {
	findAllUser()
		.then(users => res.json(users))
		.catch(error => next(apiError.badRequestError(error)))
}

/**
 * Get user by id
 */
export const getOne = (req, res, next) => {
	res.json(req.user)
}

/**
 * Update user with id
 */
export const updateOne = (req, res) => {
	res.json(`UPDATE USER WITH ID ${req.params.id}`)
}

/**
 * Delete user with id
 */
export const deleteOne = (req, res) => {
	res.json(`UPDATE USER WITH ID ${req.params.id}`)
}
