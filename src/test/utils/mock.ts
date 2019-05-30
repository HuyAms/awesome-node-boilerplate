import faker from 'faker'
import {User, UserRole} from '../../resources/user/user.interface'
import {Types} from 'mongoose'

export const createMockId = () => {
	const ObjectId = Types.ObjectId
	const id = new ObjectId()
	return id.toHexString()
}

export const createMockUser = (role: UserRole = UserRole.User): User => ({
	firstName: faker.name.findName(),
	lastName: faker.name.lastName(),
	email: faker.internet.email(),
	password: faker.internet.password(),
	role: UserRole.Admin,
})
