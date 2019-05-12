import {createLogger, format, transports, Logger} from 'winston'
import {StreamOptions} from 'morgan'
import fs from 'fs'
import path from 'path'
import config from '../config'

const logDir = 'log'

const logFormat = format.printf(
	info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`,
)

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir)
}

const filename = path.join(logDir, 'results.log')

const logger: Logger = createLogger({
	// change level if in dev environment versus production
	level: config.isProd ? 'info' : 'debug',
	format: format.combine(
		format.label({label: path.basename(process.mainModule.filename)}),
		format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
		format.splat(),
	),
	transports: [
		new transports.Console({
			format: format.combine(format.colorize(), logFormat),
		}),
		new transports.File({
			filename,
			format: format.combine(format.json()),
		}),
	],
	exitOnError: false,
})

export const stream: StreamOptions = {
	write: function(message) {
		logger.info(message)
	},
}

export default logger
