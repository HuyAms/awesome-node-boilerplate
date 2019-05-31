import {UserDocument} from '../../resources/user/user.model'
import {createUser} from '../utils/db'
import {createMockId, createMockUser} from '../utils/mock'
import {getUserById} from '../../resources/user/user.service'
import {ApiError} from '../../utils/apiError'

describe('User Service', () => {
	let user: UserDocument

	beforeEach(async done => {
		// Arrange
		const mockUser = createMockUser()
		user = await createUser(mockUser)
		done()
	})

	describe('getUserById', () => {
		it('should return correct user', async () => {
			try {
				// Action
				const foundUser = await getUserById(user.id)

				// Expect
				expect(foundUser).toEqualUser(user)
			} catch (e) {
				expect(e).toBeUndefined()
			}
		})

		it('should return error when user not found', async () => {
			try {
				// Arrange
				const mockId = createMockId()

				// Action
				const foundUser = await getUserById(mockId)

				// Expect
				expect(foundUser).toBeUndefined()
			} catch (e) {
				expect(e).toBeInstanceOf(ApiError)
			}
		})
	})
})
