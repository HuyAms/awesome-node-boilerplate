import {UserRole, UserStatus} from '../../resources/user/user.interface'
import UserModel, {UserDocument} from '../../resources/user/user.model'
import {createMockUser} from './mock'

export const addUser = (
	role: UserRole = UserRole.User,
	userStatus: UserStatus = UserStatus.Active,
): Promise<UserDocument> => {
	const mockUser = createMockUser(role, userStatus)

	const newUser = new UserModel(mockUser)
	return newUser.save()
}
