import {UserRole, UserStatus, User} from '../../resources/user/user.interface'
import UserModel, {UserDocument} from '../../resources/user/user.model'
import {createMockUser} from './mock'

export const addUser = (user: User): Promise<UserDocument> => {
	const mockUser = user || createMockUser(UserRole.User, UserStatus.Active)

	mockUser.status = mockUser.status || UserStatus.Active

	const newUser = new UserModel(mockUser)
	return newUser.save()
}
