import httpStatus from 'http-status'
import {addUser} from '../utils/db'
import {createMockId} from '../utils/mock'
import {apiRequest, getRolesWithPermisison, siginUser} from '../utils/common'
import {UserDocument} from '../../resources/user/user.model'
import {UserRole, UserStatus} from '../../resources/user/user.interface'
import {ErrorCode} from '../../utils/apiError'
import {Permission} from '../../middlewares/permission'

describe('[USERS API]', () => {
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
		getRolesWithPermisison(Permission.UserRead).forEach(role => {
			it(`[${role}]. should return 200 with found user`, async () => {
				// Arrange
				const user = users.find(user => user.role === role)
				const token = siginUser(user)

				// Action
				const result = await apiRequest
					.get(`/api/users/${dummyUser.id}`)
					.set('Authorization', token)

				// Expect
				expect(result.status).toEqual(httpStatus.OK)
				expect(result.body.data).toEqualUser(dummyUser)
			})

			it(`[${role}]. should return 404 when user not found`, async () => {
				// Arrange
				const user = users.find(user => user.role === role)
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
	})

	describe('GET /api/users/me', () => {
		getRolesWithPermisison(Permission.UserRead).forEach(role => {
			it(`[${role}]. should return 200 with my profile`, async () => {
				// Arrange
				const user = users.find(user => user.role === role)
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
	})

	describe('GET /api/users', () => {
		getRolesWithPermisison(Permission.UserRead).forEach(role => {
			it(`[${role}]. should return 200 with all users`, async () => {
				// Arrange
				const user = users.find(user => user.role === role)
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
