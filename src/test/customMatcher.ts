import {UserDocument} from '../resources/user/user.model'

expect.extend({
	toEqualUser(received: UserDocument, expected: UserDocument) {
		const pass =
			received.id === expected.id &&
			received.firstName === expected.firstName &&
			received.lastName === expected.lastName &&
			received.role === expected.role &&
			received.email === expected.email &&
			received.status === expected.status

		if (pass) {
			return {
				message: () => `expected ${received} to be equal ${expected}`,
				pass: true,
			}
		} else {
			return {
				message: () => `expected ${received} not to be equal ${expected}`,
				pass: false,
			}
		}
	},
})
