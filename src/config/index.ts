import {merge} from 'lodash'

import devConfig from './dev'
import prodConfig from './prod'
import testConfig from './test'

const env = process.env.NODE_ENV || 'development'

const baseConfig = {
	env,
	isDev: env === 'development',
	isTest: env === 'test',
	secrets: {
		jwt: process.env.JWT_SECRET,
		jwtExp: process.env.JSW_EXP || '100d',
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

const config = merge(baseConfig, envConfig)

export default config
