import {NextFunction, Request, Response} from 'express'
import {getTokenFromRequest, verifyToken} from '../utils/auth'
import apiError from '../utils/apiError'
import UserModel from '../resources/user/user.model'

/**
 * Middleware to check user's token
 *
 * - User has valid permission
 *   - Find user from database and attach to req.user
 *
 * @param optional
 * 	- If set true, only check token if header or query contains token
 */
export const checkToken = (optional: boolean = false) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const token: string = getTokenFromRequest(req)

		if (optional && !token) {
			return next()
		}

		let payload: any

		try {
			payload = await verifyToken(token)

			const {id, tokenId} = payload

			const user = await UserModel.findOne({
				_id: id,
				'passport.tokenId': tokenId,
			})

			if (!user) {
				return next(
					apiError.unauthorized(
						'Cannot find user with this token. This token may have been blacklisted',
					),
				)
			}

			req.user = user

			return next()
		} catch (e) {
			return next(apiError.unauthorized('Invalid token'))
		}
	}
}
