const mongoPort = process.env.MONGO_PORT || 27017

const config = {
	seed: false,
	loggerLevel: 'error',
	secrets: {
		jwt: 'jwttest',
		googleClientId: 'dummyGoogleClientId',
		googleClientSecret: 'dummyGoogleClientSecret',
	},
	mailSender: 'test<noreply@test.com>',
	dbUrl: `mongodb://localhost:${mongoPort}/node-boilerplate-test`,
}

export default config
