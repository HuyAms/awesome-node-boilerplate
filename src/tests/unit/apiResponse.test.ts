import faker from 'faker'
import httpStatus from 'http-status'
import {errorResponse, successResponse} from '../../utils/apiResponse'
import {ApiError} from '../../utils/apiError'

describe('[ApiResponse]', () => {
	it('should return correct errorResponse', () => {
		// Arrange
		const apiError = new ApiError(
			faker.random.words(),
			faker.random.number({min: 300, max: 500}),
			faker.random.number(),
		)

		// Action
		const res = errorResponse(apiError)

		// Expect
		expect(res.errorCode).toEqual(apiError.errorCode)
		expect(res.status).toEqual(apiError.status)
		expect(res.message).toEqual(apiError.message)
	})

	it('should return correct successResponse', () => {
		// Arrange
		const mockData = {name: faker.random.words()}
		const mockCreated = faker.random.boolean()

		// Action
		const res = successResponse(mockData, mockCreated)

		// Expect
		expect(res.data).toEqual(mockData)

		if (mockCreated) {
			expect(res.status).toEqual(httpStatus.CREATED)
		} else {
			expect(res.status).toEqual(httpStatus.OK)
		}
	})
})
