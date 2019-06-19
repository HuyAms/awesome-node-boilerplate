import httpStatus from 'http-status'
import {addUser} from '../../utils/db'
import {apiRequest} from '../../utils/common'
import {createMockUser} from '../../utils/mock'

import {User, UserStatus} from '../../../resources/user/user.interface'

describe('[SIGNIN API]', () => {
	let dummyUser: User

	beforeEach(async () => {
		// Arrange
		dummyUser = createMockUser()
		await addUser(dummyUser)
	})

	describe('POST /auth/signin', () => {
		it('should return 200 with token when sign in user successfully', async () => {
			// Arrange
			const {
				email,
				passport: {password},
			} = dummyUser

			// Action
			const result = await apiRequest
				.post('/auth/signin')
				.send({email, password})

			// Expect
			expect(result.status).toEqual(httpStatus.OK)
			expect(result.body.data.token).toBeDefined()
		})

		it('should return 401 when user logins with wrong credentials', async () => {
			// Arrange
			const user = createMockUser()
			const {
				email,
				passport: {password},
			} = user

			// Action
			const result = await apiRequest
				.post('/auth/signin')
				.send({email, password})

			// Expect
			expect(result.status).toEqual(httpStatus.UNAUTHORIZED)
		})
	})

	describe('POST /auth/signup', () => {
		it('should return 200 when sign up user successfully', async () => {
			// Arrange
			const {
				firstName,
				lastName,
				passport: {password},
			} = createMockUser()

			const newUser = {
				firstName,
				lastName,
				email: 'dinhuyams@gmail.com',
				password,
			}

			// Action
			const result = await apiRequest.post('/auth/signup').send(newUser)

			// Expect
			expect(result.status).toEqual(httpStatus.OK)
			expect(result.body.data.token).toBeDefined()
		})
	})

	describe('Test authorization', () => {
		const testAuthorization = (userStatus: UserStatus) => {
			it(`should return 403 when user status is ${userStatus}`, async () => {
				// Arrange
				const noAccessRightUser = createMockUser(undefined, userStatus)
				const {
					email,
					passport: {password},
				} = noAccessRightUser

				// Action
				const result = await apiRequest
					.post('/auth/signin')
					.send({email, password})

				// Expect
				expect(result.status).toEqual(httpStatus.UNAUTHORIZED)
			})
		}
		;[UserStatus.Initial, UserStatus.Disabled].forEach(testAuthorization)
	})
})
