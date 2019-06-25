import httpStatus from 'http-status'
import {addUser} from '../../utils/db'
import {apiRequest} from '../../utils/common'
import {createMockUser} from '../../utils/mock'
import {ErrorCode} from '../../../utils/apiError'

import {User} from '../../../resources/user/user.interface'

describe('[SIGNUP API]', () => {
	let dummyUser: User
	let existingUser: User

	beforeEach(async () => {
		dummyUser = createMockUser()
		existingUser = createMockUser()
		await addUser(existingUser)
	})

	describe('POST /auth/signup', () => {
		it('Should return 200 with token', async () => {
			// Arrange
			const {email, passport, firstName, lastName} = dummyUser
			const {password} = passport

			// Action
			const result = await apiRequest
				.post('/auth/signup')
				.send({email, passport, password, firstName, lastName})

			// Expect
			expect(result.status).toEqual(httpStatus.OK)
			expect(result.body.data.token)
		})

		it('Should return 400 with email not unique error code when signin up with existing email', async () => {
			// Arrange
			const {email, passport, firstName, lastName} = existingUser
			const {password} = passport

			// Action
			const result = await apiRequest
				.post('/auth/signup')
				.send({email, passport, password, firstName, lastName})

			const {status, errorCode} = result.body
			// Expect
			expect(status).toEqual(httpStatus.BAD_REQUEST)
			expect(errorCode).toEqual(ErrorCode.emailNotUnique)
		})

		it('Should return 400 when first name or last name is missing', async () => {
			// Arrange
			const {email, passport} = existingUser
			const {password} = passport

			// Action
			const result = await apiRequest
				.post('/auth/signup')
				.send({email, passport, password})

			const {status} = result.body
			// Expect
			expect(status).toEqual(httpStatus.BAD_REQUEST)
		})

		it('Should return 400 when user signs up with status', async () => {
			// Arrange
			const {email, passport, firstName, lastName, status} = existingUser
			const {password} = passport

			// Action
			const result = await apiRequest
				.post('/auth/signup')
				.send({email, passport, password, firstName, lastName, status})

			const {status: responseStatus} = result.body
			// Expect
			expect(responseStatus).toEqual(httpStatus.BAD_REQUEST)
		})
	})
})
