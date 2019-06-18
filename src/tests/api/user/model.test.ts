import {createMockUser} from '../../utils/mock'
import UserModel from '../../../resources/user/user.model'
import {UserRole, UserStatus} from '../../../resources/user/user.interface'

describe('[User Model]', () => {
	it('should create new user when user data is valid', async () => {
		// Arrange
		const user = createMockUser(UserRole.Admin, UserStatus.Active)

		// Action
		const createdUser = await UserModel.create(user)

		// Expect
		expect(createdUser.firstName).toEqual(user.firstName)
		expect(createdUser.lastName).toEqual(user.lastName)
		expect(createdUser.role).toEqual(user.role)
		expect(createdUser.status).toEqual(user.status)
		expect(createdUser.checkPassword(user.passport.password)).toBeTruthy()
	})

	it('should create new user with default User role and default Initial status', async () => {
		// Arrange
		const user = createMockUser(undefined, undefined)

		// Action
		const createdUser = await UserModel.create(user)

		// Expect
		expect(createdUser.firstName).toEqual(user.firstName)
		expect(createdUser.lastName).toEqual(user.lastName)
		expect(createdUser.role).toEqual(UserRole.User)
		expect(createdUser.status).toEqual(UserStatus.Initial)
		expect(createdUser.checkPassword(user.passport.password)).toBeTruthy()
	})
})
