import faker from 'faker'
import {User, UserRole, UserStatus} from '../../resources/user/user.interface'
import {Types} from 'mongoose'

export const createMockId = () => {
	const ObjectId = Types.ObjectId
	const id = new ObjectId()
	return id.toHexString()
}

export const createMockUser = (role: UserRole, status?: UserStatus): User => ({
	firstName: faker.name.firstName(),
	lastName: faker.name.lastName(),
	email: faker.internet.email(),
	password: faker.internet.password(),
	role,
	status,
})