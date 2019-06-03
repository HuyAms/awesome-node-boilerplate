import * as _ from 'lodash'

import devConfig from './devConfig'
import prodConfig from './prodConfig'
import testConfig from './testConfig'

const env = process.env.NODE_ENV || 'development'

const baseConfig = {
	env,
	isDev: env === 'development',
	isProd: env === 'production',
	isTest: env === 'test',
	port: process.env.PORT || 3000,
	clientHost: process.env.CLIENT_HOST,
	secrets: {
		jwt: process.env.JWT_SECRET,
		jwtExp: process.env.JWT_EXP || '100d',
		resetTokenExp: process.env.RESET_TOKEN_EXP || 3600000, // 1 hour
	},
	apiKeys: {
		sendGrid: process.env.SENDGRID_API_KEY,
	},
	requestLimiter: {
		timeLimit: 15 * 60 * 1000, // 15 minutes
		amountLimit: 100, // limit each IP to 100 requests per windowMs
	},
}

let envConfig

switch (env) {
	case 'development':
		envConfig = devConfig
		break

	case 'production':
		envConfig = prodConfig
		break

	case 'test':
		envConfig = testConfig
		break

	default:
		envConfig = devConfig
}

const config = _.merge(baseConfig, envConfig)

export default config
