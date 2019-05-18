import {createLogger, format, transports, Logger} from 'winston'
import {StreamOptions} from 'morgan'
import fs from 'fs'
import path from 'path'
import config from '../config'
import * as _ from 'lodash'

const logDir = 'log'

const logFormat = format.printf(
	info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`,
)

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir)
}

const filename = path.join(logDir, 'results.log')

const getLogger = (module: any): Logger => {
	const path = _.isString(module)
		? module
		: (_.last(module.filename.split('\\')) as string)

	return createLogger({
		// change level if in dev environment versus production
		level: config.isProd ? 'info' : 'debug',
		format: format.combine(
			format.label({label: path}),
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
}

export const morganStream: StreamOptions = {
	write(message) {
		getLogger('morgan').info(message)
	},
}

export default getLogger
