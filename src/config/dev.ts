const config = {
	seed: true,
	loggerLevel: 'debug',
	secrets: {
		jwt: 'jwtdev',
	},
	mailSender: 'dev<noreply@dev.com>',
	dbUrl: 'mongodb://localhost:27017/node-boilerplate-dev',
}

export default config
