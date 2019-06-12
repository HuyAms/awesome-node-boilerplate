import dotenv from 'dotenv'
const dotEnvResult = dotenv.config()

import path from 'path'
import express from 'express'
import chalk from 'chalk'
import middlewares from './middlewares/global'
import {errorHandler} from './middlewares/errorHandler'
import swagger from './middlewares/swagger'
import config from './config'
import connectDb from './services/db'
import initPassport from './services/passport'
import {seed} from './utils/seeder'

import userRouter from './resources/user/user.router'
import authRouter from './resources/auth/auth.router'
import createLogger from './utils/logger'

const logger = createLogger(module)

export const app = express()

/**
 * General setup
 */

if (config.isDev && dotEnvResult.error) {
	logger.error('Please create .env file at root folder')
}

app.use(middlewares)

app.set('view engine', 'pug')
app.set('views', 'views')
app.use(
	'/bootstrap',
	express.static(path.resolve(__dirname, '../node_modules/bootstrap/dist')),
)

initPassport()

if (config.seed) {
	app.get('/seed', (_, res) => {
		seed()
		res.send('Database seeded')
	})
}

/**
 * Routers
 */
app.use('/auth', authRouter)

app.use('/api/users', userRouter)

app.use('/api-docs', swagger)

app.get('/', (req, res) => {
	res.redirect('/api-docs')
})

app.use(errorHandler)

/**
 * Connect database
 * Start Express server
 */
const {port, env} = config

export const start = async () => {
	try {
		await connectDb()

		app.listen(port, () => {
			logger.info(
				`App is running on port ${chalk.yellow(
					port as string,
				)} in ${chalk.yellow(env)} mode \n
				http://localhost:${port} \n
				Press CTRL-C to stop
				`,
			)
		})
	} catch (e) {
		logger.error(e.message)
	}
}
