import faker from 'faker'
import {getTokenFromRequest} from '../../utils/auth'

describe('[ApiResponse]', () => {
	it('should return correct token from request header', () => {
		// Arrange
		const mockToken = faker.random.uuid()

		let mockRequest = {
			query: {},
			headers: {
				authorization: 'Bearer ' + mockToken,
			},
		}

		// Action
		const token = getTokenFromRequest(mockRequest)

		// Expect
		expect(token).toEqual(mockToken)
	})

	it('should return correct token from request query', () => {
		// Arrange
		const mockToken = faker.random.uuid()

		let mockRequest = {
			query: {['access-token']: mockToken},
			headers: {},
		}

		// Action
		const token = getTokenFromRequest(mockRequest)

		// Expect
		expect(token).toEqual(mockToken)
	})
})
