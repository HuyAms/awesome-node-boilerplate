import {findAllUser, findUserWithId} from '../../mockDB/db'

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
	findUserWithId(req.id)
		.then(user => res.status(200).json(user))
		.catch(next)
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
