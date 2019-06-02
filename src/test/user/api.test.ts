import httpStatus from 'http-status'
import {addUser} from '../utils/db'
import {createMockId} from '../utils/mock'
import {
	apiRequest,
	getRoleWithoutPermission,
	getRoleWithPermisison,
	siginUser,
	sortArrayByField,
} from '../utils/common'
import {UserDocument} from '../../resources/user/user.model'
import {UserRole, UserStatus} from '../../resources/user/user.interface'
import {ErrorCode} from '../../utils/apiError'
import {Permission} from '../../middlewares/permission'
import {Sort} from '../../middlewares/validator'

describe('[USERS API]', () => {
	const sortFields = ['firstName', 'lastName', 'email']
	const roleWithUserRead = getRoleWithPermisison(Permission.UserRead)
	const roleWithUserWrite = getRoleWithPermisison(Permission.UserWrite)
	const roleWithoutUserWrite = getRoleWithoutPermission(Permission.UserWrite)

	let users: UserDocument[]
	let dummyUser: UserDocument

	beforeEach(async () => {
		// Arrange

		;[dummyUser] = users = await Promise.all([
			addUser(),
			addUser(UserRole.User),
			addUser(UserRole.Admin),
		])
	})

	describe('GET /api/users/:id', () => {
		it(`[${roleWithUserRead}]. should return 200 with found user`, async () => {
			// Arrange
			const user = users.find(user => user.role === roleWithUserRead)
			const token = siginUser(user)

			// Action
			const result = await apiRequest
				.get(`/api/users/${dummyUser.id}`)
				.set('Authorization', token)

			// Expect
			expect(result.status).toEqual(httpStatus.OK)
			expect(result.body.data).toEqualUser(dummyUser)
		})

		it(`[${roleWithUserRead}]. should return 404 when user not found`, async () => {
			// Arrange
			const user = users.find(user => user.role === roleWithUserRead)
			const token = siginUser(user)
			const mockId = createMockId()

			// Action
			const res = await apiRequest
				.get(`/api/users/${mockId}`)
				.set('Authorization', token)

			// Expect
			expect(res.status).toEqual(httpStatus.NOT_FOUND)
		})
	})

	describe('GET /api/users/me', () => {
		it(`[${roleWithUserRead}]. should return 200 with my profile`, async () => {
			// Arrange
			const user = users.find(user => user.role === roleWithUserRead)
			const token = siginUser(user)

			// Action
			const result = await apiRequest
				.get('/api/users/me')
				.set('Authorization', token)

			// Expect
			expect(result.status).toEqual(httpStatus.OK)
			expect(result.body.data).toEqualUser(user)
		})
	})

	describe('GET /api/users', () => {
		it(`[${roleWithUserRead}]. should return 200 with all users`, async () => {
			// Arrange
			const user = users.find(user => user.role === roleWithUserRead)
			const token = siginUser(user)

			// Action
			const result = await apiRequest
				.get('/api/users')
				.set('Authorization', token)

			// Expect
			expect(result.status).toEqual(httpStatus.OK)

			const {data} = result.body
			expect(data.length).toEqual(users.length)
		})

		const testUsersSortedByField = async (field: string, sort: Sort) => {
			// Arrange
			const user = users.find(user => user.role === roleWithUserRead)
			const token = siginUser(user)

			// Action
			const result = await apiRequest
				.get('/api/users')
				.query({field, sort})
				.set('Authorization', token)

			// Expect
			expect(result.status).toEqual(httpStatus.OK)

			const {data} = result.body
			expect(data.length).toEqual(users.length)

			const sortedUsers = sortArrayByField(users, field, sort)

			data.forEach((user: UserDocument, index: number) => {
				expect(user).toEqualUser(sortedUsers[index])
			})
		}

		sortFields.forEach(field => {
			it(`[${roleWithUserRead}]. should return 200 with field ${field} sorted asc`, async () => {
				await testUsersSortedByField(field, Sort.asc)
			})

			it(`[${roleWithUserRead}]. should return 200 with field ${field} sorted desc`, async () => {
				await testUsersSortedByField(field, Sort.desc)
			})
		})
	})

	describe('DELETE /api/users/:id', () => {
		it(`[${roleWithUserWrite}]. should return 200 with deleted user`, async () => {
			// Arrange
			const user = users.find(user => user.role === roleWithUserWrite)
			const token = siginUser(user)

			// Action
			const result = await apiRequest
				.del(`/api/users/${dummyUser.id}`)
				.set('Authorization', token)

			// Expect
			expect(result.status).toEqual(httpStatus.OK)
			expect(result.body.data).toEqualUser(dummyUser)
		})

		it(`[${roleWithUserWrite}]. should return 404 when delete user not found`, async () => {
			// Arrange
			const user = users.find(user => user.role === roleWithUserWrite)
			const token = siginUser(user)
			const mockId = createMockId()

			// Action
			const res = await apiRequest
				.del(`/api/users/${mockId}`)
				.set('Authorization', token)

			// Expect
			expect(res.status).toEqual(httpStatus.NOT_FOUND)
		})

		it(`[${roleWithoutUserWrite}]. should return 401 when user does not have UserWrite permission`, async () => {
			// Arrange
			const user = users.find(user => user.role === roleWithoutUserWrite)
			const token = siginUser(user)

			// Action
			const result = await apiRequest
				.del(`/api/users/${dummyUser.id}`)
				.set('Authorization', token)

			// Expect
			expect(result.status).toEqual(httpStatus.FORBIDDEN)
		})
	})

	describe('Authentication and Authorization', () => {
		it('should return 401 when there is no token', async () => {
			// Arrange
			const mockId = createMockId()

			// Action
			const results = await Promise.all([
				apiRequest.get('/api/users'),
				apiRequest.get('/api/users/me'),
				apiRequest.get(`/api/users/${mockId}`),
				apiRequest.put(`/api/users/${mockId}`),
				apiRequest.delete(`/api/users/${mockId}`),
			])

			// Expect
			results.forEach(res =>
				expect(res.status).toEqual(httpStatus.UNAUTHORIZED),
			)
		})

		const testAuthorization = (userStatus: UserStatus) => {
			it(`should return 403 when user status is ${userStatus}`, async () => {
				// Arrange
				const mockId = createMockId()

				const noAccessRightUser = await addUser(undefined, userStatus)
				const noAccessRightToken = siginUser(noAccessRightUser)

				// Action
				const results = await Promise.all([
					apiRequest.get('/api/users').set('Authorization', noAccessRightToken),
					apiRequest
						.get('/api/users/me')
						.set('Authorization', noAccessRightToken),
					apiRequest
						.get(`/api/users/${mockId}`)
						.set('Authorization', noAccessRightToken),
					apiRequest
						.put(`/api/users/${mockId}`)
						.set('Authorization', noAccessRightToken),
					apiRequest
						.delete(`/api/users/${mockId}`)
						.set('Authorization', noAccessRightToken),
				])

				// Expect
				results.forEach(res => {
					expect(res.status).toEqual(httpStatus.FORBIDDEN)
					expect(res.body.errorCode).toEqual(ErrorCode.notActiveUser)
				})
			})
		}
		;[UserStatus.Initial, UserStatus.Disabled].forEach(testAuthorization)
	})
})
