import {app} from './server'
import config from './config'
import chalk from 'chalk'
import createLogger from './utils/logger'
import connectDb from './services/db'

const logger = createLogger(module)

connectDb().then(() => {
	logger.info('Connect to DB successfully!')
})

const server = app.listen(config.port, () => {
	logger.info(
		`App is running on port ${chalk.yellow(
			config.port as string,
		)} in ${chalk.yellow(config.env)} mode \n
				http://localhost:${config.port} \n
				Press CTRL-C to stop
				`,
	)
})

process.on('unhandledRejection', e => {
	logger.error('Unhandled Rejection! Shutting down server ...')
	logger.error(e)
	server.close(() => {
		process.exit(1)
	})
})

process.on('SIGTERM', () => {
	logger.error('Sigterm Received. Shutting down server...')
	server.close(() => {
		logger.error('Process terminated!')
	})
})
