import {IUser, UserRole, UserStatus} from '../resources/user/user.interface'
import {create} from '../resources/user/user.service'
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

export const seed = () => {
	logger.debug(`Database seeded`)
	create(mockUser1)
	create(mockUser2)
}
