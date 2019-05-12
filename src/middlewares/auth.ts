import {findUserWithId} from '../mockDB/db'
import {getTokenFromRequest, verifyToken} from '../utils/auth'
import error from '../utils/apiError'

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
export const checkToken = async (req, res, next) => {
	const token = getTokenFromRequest(req)

	let payload

	try {
		payload = await verifyToken(token)
	} catch (e) {
		return next(error.unauthorized('Invalid token'))
	}

	let user
	try {
		user = await findUserWithId(payload.id)
	} catch (e) {
		return next(error.unauthorized('Cannot find user with that token'))
	}

	req.user = user

	next()
}
