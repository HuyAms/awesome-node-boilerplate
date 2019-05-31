import _ from 'lodash'
import httpStatus from 'http-status'
import {createUser} from '../utils/db'
import {createMockId, createMockUser} from '../utils/mock'
import {newToken} from '../../utils/auth'
import {apiRequest} from '../utils/common'
import {UserDocument} from '../../resources/user/user.model'

describe('[USERS API]', () => {
	let user1: UserDocument
	let user2: UserDocument
	// let users: UserDocument[]
	let token: string

	beforeEach(async () => {
		// Arrange
		;[user1, user2] = await Promise.all(
			_.times(10, () => {
				const mockUser = createMockUser()
				return createUser(mockUser)
			}),
		)

		token = `Bearer ${newToken(user1)}`
	})

	describe('GET /api/users/:id', () => {
		it('should return 200 with found user', async () => {
			// Action
			const result = await apiRequest
				.get(`/api/users/${user2.id}`)
				.set('Authorization', token)

			// Expect
			expect(result.status).toEqual(httpStatus.OK)
			expect(result.body.data).toEqualUser(user2)
		})

		it('should return 400 when user not found', async () => {
			// Arrange
			const mockId = createMockId()

			// Action
			const res = await apiRequest
				.get(`/api/users/${mockId}`)
				.set('Authorization', token)

			// Expect
			expect(res.status).toEqual(httpStatus.NOT_FOUND)
		})
	})

	describe('Authentication', () => {
		it('should return 401 when there is no or invalid token', async () => {
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
	})
})
