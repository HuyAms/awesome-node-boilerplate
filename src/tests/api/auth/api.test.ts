import httpStatus from 'http-status'
import faker from 'faker'
import {addUser} from '../../utils/db'
import {apiRequest} from '../../utils/common'
import {createMockUser} from '../../utils/mock'

import {User} from '../../../resources/user/user.interface'
import {ErrorCode} from '../../../utils/apiError'

describe('[AUTH API]', () => {
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
			const {token} = result.body.data
			expect(result.status).toEqual(httpStatus.OK)
			expect(token).toBeDefined()
		})

		it('should return 401 when user logins with wrong password', async () => {
			// Arrange
			const {email} = dummyUser

			const wrongPassword = faker.internet.password()

			// Action
			const result = await apiRequest.post('/auth/signin').send({
				email,
				password: wrongPassword,
			})

			// Expect
			expect(result.status).toEqual(httpStatus.UNAUTHORIZED)
			expect(result.body.errorCode).toEqual(ErrorCode.passwordNotCorrect)
		})

		it('should return 401 when user logins with wrong email', async () => {
			// Arrange
			const {
				passport: {password},
			} = dummyUser

			const wrongEmail = faker.internet.email()

			// Action
			const result = await apiRequest.post('/auth/signin').send({
				email: wrongEmail,
				password,
			})

			// Expect
			expect(result.status).toEqual(httpStatus.UNAUTHORIZED)
			expect(result.body.errorCode).toEqual(ErrorCode.emailNotCorrect)
		})
	})

	describe('POST /auth/signup', () => {
		it('should return 200 when sign up user successfully', async () => {
			// Arrange
			const {
				firstName,
				lastName,
				email,
				passport: {password},
			} = createMockUser()

			const newUser = {
				firstName,
				lastName,
				email,
				password,
			}

			// Action
			const result = await apiRequest.post('/auth/signup').send(newUser)

			// Expect
			const {token} = result.body.data
			expect(result.status).toEqual(httpStatus.OK)
			expect(token).toBeDefined()
		})
	})
})
