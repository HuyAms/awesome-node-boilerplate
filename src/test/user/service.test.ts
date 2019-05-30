import {UserDocument} from '../../resources/user/user.model'
import {createUser} from '../utils/db'
import {createMockId, createMockUser} from '../utils/mock'
import {findById} from '../../resources/user/user.service'
import {ApiError} from '../../utils/apiError'

describe('User Service', () => {
	let user: UserDocument

	beforeEach(async done => {
		const mockUser = createMockUser()
		user = await createUser(mockUser)
		done()
	})

	describe('findById', () => {
		it('should return correct user', async () => {
			try {
				const foundUser = await findById(user.id)

				expect(foundUser).toEqualUser(user)
			} catch (e) {
				expect(e).toBeUndefined()
			}
		})

		it('should return error when user not found', async () => {
			try {
				const mockId = createMockId()

				const foundUser = await findById(mockId)
				expect(foundUser).toBeUndefined()
			} catch (e) {
				expect(e).toBeInstanceOf(ApiError)
			}
		})
	})
})
