import faker from 'faker'
import _ from 'lodash'
import {createMockUser} from '../../utils/mock'
import UserModel from '../../../resources/user/user.model'
import {
	User,
	UserRole,
	UserStatus,
} from '../../../resources/user/user.interface'
import {Error} from 'mongoose'
import {generateResetToken} from '../../../utils/util'

describe('[User Model]', () => {
	const requiredFields = ['firstName', 'lastName', 'email']

	let mockUser: User

	beforeEach(() => {
		mockUser = createMockUser(UserRole.Admin, UserStatus.Active)
	})

	it('should create new user when user data is valid', async () => {
		// Action
		const createdUser = await UserModel.create(mockUser)

		// Expect
		expect(createdUser.firstName).toEqual(mockUser.firstName)
		expect(createdUser.lastName).toEqual(mockUser.lastName)
		expect(createdUser.role).toEqual(mockUser.role)
		expect(createdUser.status).toEqual(mockUser.status)
		expect(createdUser.checkPassword(mockUser.passport.password)).toBeTruthy()
	})

	it('should create new user with default User role and default Initial status', async () => {
		// Arrange
		mockUser.role = undefined
		mockUser.status = undefined

		// Action
		const createdUser = await UserModel.create(mockUser)

		// Expect
		expect(createdUser.firstName).toEqual(mockUser.firstName)
		expect(createdUser.lastName).toEqual(mockUser.lastName)
		expect(createdUser.role).toEqual(UserRole.User)
		expect(createdUser.status).toEqual(UserStatus.Initial)
		expect(createdUser.checkPassword(mockUser.passport.password)).toBeTruthy()
	})

	it('should hash password when create user', async () => {
		// Action
		const createdUser = await UserModel.create(mockUser)

		// Expect
		expect(createdUser.passport.password).not.toEqual(
			mockUser.passport.password,
		)
	})

	it('should create reset token when clearResetToken called', async () => {
		// Arrange
		const createdUser = await UserModel.create(mockUser)

		const {resetToken, resetTokenExp} = generateResetToken()
		createdUser.passport.resetToken = resetToken
		createdUser.passport.resetTokenExp = resetTokenExp

		// Action
		createdUser.clearResetToken()

		// Expect
		expect(createdUser.passport.resetToken).toBeNull()
		expect(createdUser.passport.resetTokenExp).toBeNull()
	})

	it('should revoke old token when revokeOldToken called', async () => {
		// Arrange
		const createdUser = await UserModel.create(mockUser)
		const oldTokenId = createdUser.passport.tokenId

		// Action
		createdUser.revokeOldToken()

		// Expect
		expect(createdUser.passport.tokenId).not.toEqual(oldTokenId)
	})

	it('should revoke old token when user change password', async () => {
		// Arrange
		const createdUser = await UserModel.create(mockUser)
		const oldTokenId = createdUser.passport.tokenId

		// Action
		createdUser.passport.password = faker.internet.password()
		const updatedPasswordUser = await createdUser.save()

		// Expect
		expect(updatedPasswordUser.passport.tokenId).not.toEqual(oldTokenId)
	})

	it('should throw error when create user with short password', async () => {
		// Arrange
		const passwordLength = 2
		const shortPasword = faker.internet.password(passwordLength)
		mockUser.passport.password = shortPasword

		// Action
		const createUser = UserModel.create(mockUser)

		// Expect
		await expect(createUser).rejects.toThrow(Error)
	})

	it('should throw error when create user with short firstName', async () => {
		// Arrange
		const shortFirstName = faker.random.alphaNumeric(1)
		mockUser.firstName = shortFirstName

		// Action
		const createUser = UserModel.create(mockUser)

		// Expect
		await expect(createUser).rejects.toThrow(Error)
	})

	it('should throw error when create user with short lastName', async () => {
		// Arrange
		const shortLastName = faker.random.alphaNumeric(1)
		mockUser.lastName = shortLastName

		// Action
		const createUser = UserModel.create(mockUser)

		// Expect
		await expect(createUser).rejects.toThrow(Error)
	})

	it('should throw error when create user with invalid role', async () => {
		// Arrange
		const invalidRole = faker.random.word()
		const userWithInvalidRole = mockUser as any
		userWithInvalidRole.role = invalidRole

		// Action
		const createUser = UserModel.create(userWithInvalidRole)

		// Expect
		await expect(createUser).rejects.toThrow(Error)
	})

	it('should throw error when create user with invalid status', async () => {
		// Arrange
		const invalidStatus = faker.random.word()
		const userWithInvalidStatus = mockUser as any
		userWithInvalidStatus.status = invalidStatus

		// Action
		const createUser = UserModel.create(userWithInvalidStatus)

		// Expect
		await expect(createUser).rejects.toThrow(Error)
	})

	const testRequiredField = (field: string) => {
		it(`should throw error when create user with missing ${field} field`, async () => {
			// Arrange
			const userWithMissingField = _.omit(mockUser, field)

			// Action
			const createUser = UserModel.create(userWithMissingField)

			// Expect
			await expect(createUser).rejects.toThrow(Error)
		})
	}

	requiredFields.forEach(testRequiredField)
})
