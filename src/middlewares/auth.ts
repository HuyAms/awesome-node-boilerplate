import {RequestHandler} from 'express'
import {getTokenFromRequest, verifyToken} from '../utils/auth'
import apiError from '../utils/apiError'
import UserModel from '../resources/user/user.model'

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

		const {id, tokenId} = payload
		const user = await UserModel.findOne({_id: id, tokenId})

		req.user = user

		if (!user) {
			return next(
				apiError.unauthorized(
					'Cannot find user with this token. This token may have been blacklisted',
				),
			)
		}

		next()
	} catch (e) {
		return next(apiError.unauthorized('Invalid token'))
	}
}
