import {User, UserRole, UserStatus} from '../resources/user/user.interface'
import UserModel from '../resources/user/user.model'
import createLogger from '../utils/logger'

const logger = createLogger(module)

const mockUser1: User = {
	firstName: 'fName1',
	lastName: 'lName1',
	email: 'user@gmail.com',
	passport: {
		password: '123456',
	},
	role: UserRole.User,
	status: UserStatus.Active,
}

const mockUser2: User = {
	firstName: 'fName2',
	lastName: 'lName2',
	email: 'admin@gmail.com',
	passport: {
		password: '123456',
	},
	role: UserRole.Admin,
	status: UserStatus.Active,
}

const mockUsers = [mockUser1, mockUser2]

const cleanDB = () => {
	return UserModel.deleteMany({})
}

const createUsers = () => {
	return mockUsers.map(mockUser => UserModel.create(mockUser))
}

export const seed = async () => {
	try {
		await cleanDB()

		logger.debug(`Database cleaned`)

		await Promise.all(createUsers())

		logger.debug(`Database seeded`)
	} catch (e) {
		logger.error('Seed database error: ‰o', e)
	}
}
