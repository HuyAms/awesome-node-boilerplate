import dotenv from 'dotenv'
const dotEnvResult = dotenv.config()

import express from 'express'
import middlewares from './middlewares/global'
import {errorHandler} from './middlewares/errorHandler'
import swagger from './middlewares/swagger'
import config from './config'
import {seed} from './utils/seeder'

import userRouter from './resources/user/user.router'
import authRouter from './resources/auth/auth.router'
import createLogger from './utils/logger'
import {limitRequest} from './utils/requestLimiter'

const logger = createLogger(module)

export const app = express()

/**
 * Dotenv
 */

if (!config.isProd && dotEnvResult.error) {
	logger.error('Please create .env file at root folder')
}

/**
 * Global middlewares
 */
app.use(middlewares)

/**
 * Passport
 *
 */
import './services/passport'

/**
 * Seed data for dev
 */
if (config.seed) {
	seed()
}

/**
 * Limit requests for specific routes
 *
 */
const {authAmountLimit} = config.requestLimiter

/**
 * Routers
 */
app.use('/auth', limitRequest(null, authAmountLimit), authRouter)

app.use('/api/users', limitRequest(), userRouter)

app.use('/api-docs', swagger)

app.get('/', (req, res) => {
	res.redirect('/api-docs')
})

/**
 * Error Handler
 */

app.use(errorHandler)

/**
 * Start Express server
 */
const {port, env} = config

export const start = () => {
	try {
		app.listen(port, () => {
			logger.info(`App is running on port ${port} in ${env} mode`)
		})
	} catch (e) {
		logger.error(e.message)
	}
}
