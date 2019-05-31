import _ from 'lodash'
import mongoose, {Collection} from 'mongoose'
import {UserRole, UserStatus} from '../../resources/user/user.interface'
import UserModel, {UserDocument} from '../../resources/user/user.model'
import {createMockUser} from './mock'

const remove = async (collection: Collection) => {
	try {
		await collection.deleteMany({})
		return Promise.resolve()
	} catch (e) {
		return Promise.reject(e)
	}
}

export const clearDB = () => {
	return Promise.all(_.map(mongoose.connection.collections, c => remove(c)))
}

export const addUser = (
	role: UserRole = UserRole.User,
	userStatus: UserStatus = UserStatus.Active,
): Promise<UserDocument> => {
	const mockUser = createMockUser(role, userStatus)

	const newUser = new UserModel(mockUser)
	return newUser.save()
}
