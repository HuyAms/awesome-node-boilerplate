import {IUser, UserRole, UserStatus} from '../resources/user/user.interface'
import User from '../resources/user/user.model'
import createLogger from '../utils/logger'

const logger = createLogger(module)

const mockUser1: IUser = {
	id: undefined,
	firstName: 'fName1',
	lastName: 'lName1',
	email: 'user@gmail.com',
	password: '123456',
	role: UserRole.User,
	status: UserStatus.Active,
}

const mockUser2: IUser = {
	id: undefined,
	firstName: 'fName2',
	lastName: 'lName2',
	email: 'admin@gmail.com',
	password: '123456',
	role: UserRole.Admin,
	status: UserStatus.Active,
}

const mockUsers = [mockUser1, mockUser2]

const cleanDB = () => {
	return User.remove({})
}

const createUsers = () => {
	return mockUsers.map(mockUser => User.create(mockUser))
}

export const seed = async () => {
	await cleanDB()
	await Promise.all(createUsers())

	logger.debug(`Database seeded`)
}
