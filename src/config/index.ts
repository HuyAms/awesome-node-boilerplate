import * as _ from 'lodash'

import devConfig from './dev'
import prodConfig from './prod'
import testConfig from './test'

const env = process.env.NODE_ENV || 'development'

const baseConfig = {
	env,
	isDev: env === 'development',
	isProd: env === 'production',
	isTest: env === 'test',
	port: process.env.PORT || 3000,
	secrets: {
		jwt: process.env.JWT_SECRET,
		jwtExp: process.env.JWT_EXP || '100d',
		resetTokenExp: process.env.RESET_TOKEN_EXP || 3600000, // 1 hour
	},
	apiKeys: {
		sendGrid: process.env.SENDGRID_API_KEY,
	},
	requestLimiter: {
		defaultTimeLimit: 15 * 60 * 1000, // 15 minutes
		defaultAmountLimit: 100,
		authAmountLimit: 50,
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
