import {createUser} from '../mockDB/db'
import UserModel, {UserRole} from '../resources/user/user.model'

const mockUser1: UserModel = {
	id: undefined,
	firstName: 'fName1',
	lastName: 'lName1',
	email: 'user@gmail.com',
	password: '123456',
	role: UserRole.User,
}

const mockUser2: UserModel = {
	id: undefined,
	firstName: 'fName2',
	lastName: 'lName2',
	email: 'admin@gmail.com',
	password: '123456',
	role: UserRole.Admin,
}

export const seed = () => {
	createUser(mockUser1)
	createUser(mockUser2)
}
