import {findUserWithId} from '../mockDB/db'
import {getTokenFromHeader, verifyToken} from '../utils/auth'

export const checkToken = async (req, res, next) => {
	const token = getTokenFromHeader(req)

	let payload

	try {
		payload = await verifyToken(token)
	} catch (e) {
		return res.status(401).end()
	}

	const user = await findUserWithId(payload.id)

	if (!user) {
		return res.status(401).end()
	}

	req.user = user

	next()
}
