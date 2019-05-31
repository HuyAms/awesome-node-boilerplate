import {UserDocument} from '../../resources/user/user.model'

declare global {
	namespace jest {
		interface Matchers<R> {
			toEqualUser(user: UserDocument): R
		}
	}

	namespace Express {
		interface Request {
			foundUser?: any
		}
	}
}
