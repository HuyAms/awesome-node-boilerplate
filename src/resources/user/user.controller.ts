import {RequestHandler, RequestParamHandler} from 'express'
import * as services from './user.service'
import {successResponse} from '../../utils/apiResponse'

/**
 * Find user with req.params.id
 * - If found then attach user to req
 *
 * @param req
 * @param res
 * @param next
 * @param id
 */
export const params: RequestParamHandler = async (req, res, next, id) => {
	try {
		const user = await services.findById(id)

		req.user = user

		next()
	} catch (e) {
		return next(e)
	}
}

/**
 * Get me
 *
 * @param req
 * @param res
 */
export const getMe: RequestHandler = (req, res) => {
	return res.json(successResponse(req.user))
}

/**
 * Get users
 *
 * @param req
 * @param res
 * @param next
 */
export const getMany: RequestHandler = async (req, res, next) => {
	try {
		const {field, sort} = req.query
		const users = await services.getMany(field, sort)
		return res.json(successResponse(users))
	} catch (e) {
		return next(e)
	}
}

/**
 * Get user by id
 *
 * @param req
 * @param res
 */
export const getOne: RequestHandler = async (req, res, next) => {
	const {user} = req
	return res.json(successResponse(user))
}

/**
 * Update user with id
 *
 * @param req
 * @param res
 */
export const updateOne: RequestHandler = async (req, res, next) => {
	try {
		const {user, body} = req
		const updatedUser = await services.updateOne(user.id, body)
		return res.json(successResponse(updatedUser, true))
	} catch (e) {
		return next(e)
	}
}

/**
 * Delete user with id
 *
 * @param req
 * @param res
 */
export const deleteOne: RequestHandler = async (req, res, next) => {
	try {
		const {user} = req
		const removedUser = await services.deleteOne(user.id)
		return res.json(successResponse(removedUser, true))
	} catch (e) {
		return next(e)
	}
}
