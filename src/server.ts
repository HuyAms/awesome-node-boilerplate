import express from 'express'
import middlewares from './middlewares/global'
import errorHandler from './middlewares/errorHandler'
import dotenv from 'dotenv'
import config from './config'
import {seed} from './utils/seeder'

import userRouter from './resources/user/user.router'
import authRouter from './resources/auth/auth.router'
import createLogger from './utils/logger'

const logger = createLogger(module)

export const app = express()

/**
 * Dotenv
 */
dotenv.config()

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
 * Routers
 */
app.use('/auth', authRouter)

app.use('/api/users', userRouter)

/**
 * Error Handler
 */

app.use(errorHandler)

/**
 * Start Express server
 */
const {port} = config

export const start = () => {
	try {
		app.listen(port, () => {
			logger.info(`REST API on port ${port}`)
		})
	} catch (e) {
		logger.error(e.message)
	}
}
