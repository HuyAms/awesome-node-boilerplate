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

		token = newToken(user1)
	})

	describe('GET api/users/:id', () => {
		it('should return 200 with found user', async () => {
			// Action
			const res = await apiRequest
				.get(`/api/users/${user2.id}`)
				.set('Authorization', `Bearer ${token}`)

			// Expect
			expect(res.status).toEqual(httpStatus.OK)
			expect(res.body.data).toEqualUser(user2)
		})

		it('should return 400 when user not found', async () => {
			// Arrange
			const mockId = createMockId()

			// Action
			const res = await apiRequest
				.get(`/api/users/${mockId}`)
				.set('Authorization', `Bearer ${token}`)

			// Expect
			expect(res.status).toEqual(httpStatus.NOT_FOUND)
		})
	})
})
