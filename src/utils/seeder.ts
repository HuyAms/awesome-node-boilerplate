import {createUser} from '../mockDB/db'
import {UserModel, UserRole, UserStatus} from '../resources/user/user.model'
import createLogger from '../utils/logger'

const logger = createLogger(module)

const mockUser1: UserModel = {
	id: undefined,
	firstName: 'fName1',
	lastName: 'lName1',
	email: 'user@gmail.com',
	password: '123456',
	role: UserRole.User,
	status: UserStatus.Active,
}

const mockUser2: UserModel = {
	id: undefined,
	firstName: 'fName2',
	lastName: 'lName2',
	email: 'admin@gmail.com',
	password: '123456',
	role: UserRole.Admin,
	status: UserStatus.Active,
}

export const seed = () => {
	logger.debug(`Database seeded`)
	createUser(mockUser1)
	createUser(mockUser2)
}
