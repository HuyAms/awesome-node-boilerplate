import {findUserWithId} from '../mockDB/db'
import {getTokenFromRequest, verifyToken} from '../utils/auth'
import apiError from '../utils/apiError'
import {RequestHandler} from 'express'

/**
 * Middleware to check user's token
 *
 * - User has valid permission
 *   - Find user from database and attach to req.user
 *
 * @param req
 * @param res
 * @param next
 */
export const checkToken: RequestHandler = async (req, res, next) => {
	const token: string = getTokenFromRequest(req)

	let payload: any

	try {
		payload = await verifyToken(token)
	} catch (e) {
		return next(apiError.unauthorized('Invalid token'))
	}

	let user
	try {
		user = await findUserWithId(payload.id)
	} catch (e) {
		return next(apiError.unauthorized('Cannot find user with that token'))
	}

	req.user = user

	next()
}
