import {findUserWithId} from '../mockDB/db'
import {getTokenFromRequest, verifyToken} from '../utils/auth'

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
		return res.status(401).end()
	}

	let user
	try {
		user = await findUserWithId(payload.id)
	} catch (e) {
		return res.status(401).end()
	}

	req.user = user

	next()
}
