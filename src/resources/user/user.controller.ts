import {findAllUser, findUserWithId} from '../../mockDB/db'

/**
 * Find user with req.params.id
 * - If found then attach user to req
 */
export const params = (req, res, next, id) => {
	findUserWithId(Number(id))
		.then(user => (req.user = user))
		.catch(next)
}

/**
 * Get me
 */
export const getMe = (req, res, next) => {
	res.status(200).json(req.user)
}

/**
 * Get users
 */
export const getMany = (req, res, next) => {
	findAllUser()
		.then(users => res.status(200).json(users))
		.catch(next)
}

/**
 * Get user by id
 */
export const getOne = (req, res, next) => {
	res.status(200).json(req.user)
}

/**
 * Update user with id
 */
export const updateOne = (req, res) => {
	res.status(200).json(`UPDATE USER WITH ID ${req.params.id}`)
}

/**
 * Delete user with id
 */
export const deleteOne = (req, res) => {
	res.status(200).json(`UPDATE USER WITH ID ${req.params.id}`)
}
