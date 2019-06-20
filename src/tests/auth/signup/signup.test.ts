import httpStatus from 'http-status'
import {addUser} from '../../utils/db'
import {apiRequest} from '../../utils/common'
import {createMockUser} from '../../utils/mock'

import {User} from '../../../resources/user/user.interface'

describe('[SIGNUP API]', () => {
	let dummyUser: User

	beforeEach(async () => {
		dummyUser = createMockUser()
		await addUser(createMockUser())
	})

	describe('POST /auth/signup', () => {
		it('Should return 200 with token', async () => {
			// Arrange
			const {email, passport, firstName, lastName} = dummyUser
			const {password} = passport

			// Actoin
			const result = await apiRequest
				.post('/auth/signup')
				.send({email, passport, password, firstName, lastName})

			// Expect
			expect(result.status).toEqual(httpStatus.OK)
			expect(result.body.data.token)
		})
	})
})
