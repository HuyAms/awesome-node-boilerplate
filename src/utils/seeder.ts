import {createUser} from '../mockDB/db'
import {UserRole, User} from '../resources/user/user.interface'
import createLogger from '../utils/logger'
const logger = createLogger(module)

const mockUser1: User = {
	id: undefined,
	firstName: 'fName1',
	lastName: 'lName1',
	email: 'dinhhuyams@gmail.com',
	password: '123456',
	role: UserRole.User,
}

const mockUser2: User = {
	id: undefined,
	firstName: 'fName2',
	lastName: 'lName2',
	email: 'admin@gmail.com',
	password: '123456',
	role: UserRole.Admin,
}

export const seed = () => {
	logger.debug(`Database seeded`)
	createUser(mockUser1)
	createUser(mockUser2)
}
