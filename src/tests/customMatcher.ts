import chalk from 'chalk'

expect.extend({
	toEqualUser(received: any, expected: any) {
		const testedFields = [
			'id',
			'firstName',
			'lastName',
			'role',
			'email',
			'status',
		]

		let errorMessage = ''

		const results = testedFields.map(field => {
			let receivedValue: any
			let expectedValue: any

			if (field === 'id') {
				receivedValue = received.id || received._id.toString()
				expectedValue = expected.id || expected._id.toString()
			} else {
				receivedValue = received[field]
				expectedValue = expected[field]
			}

			const result = receivedValue === expectedValue
			if (!result) {
				errorMessage += `Expected field ${chalk.cyan(
					field,
				)} has value ${chalk.yellow(expectedValue)} but Received ${chalk.red(
					receivedValue,
				)} \n`
			}

			return result
		})

		const pass = results.reduce(
			(prevValue, currentValue) => prevValue && currentValue,
			true,
		)

		if (pass) {
			return {
				message: () => `expected ${received} to be equal ${expected}`,
				pass: true,
			}
		} else {
			return {
				message: () => errorMessage,
				pass: false,
			}
		}
	},
})
