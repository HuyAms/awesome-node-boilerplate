const mongoPort = process.env.MONGO_PORT || 27017

const config = {
	seed: false,
	loggerLevel: 'debug',
	secrets: {
		jwt: 'jwttest',
	},
	mailSender: 'test<noreply@test.com>',
	dbUrl: `mongodb://localhost:${mongoPort}/node-boilerplate-dev`,
}

export default config
