import {createLogger, format, transports, Logger} from 'winston'
import {StreamOptions} from 'morgan'
import fs from 'fs'
import path from 'path'
import config from '../config'
import _ from 'lodash'
import chalk from 'chalk'

const logDir = 'log'

const logFormat = format.printf(info => {
	const {timestamp, level, label, message, stack} = info
	return `${timestamp} ${level} [${chalk.magenta(label)}]: ${
		stack ? stack : message
	} \n`
})

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir)
}

const filename = path.join(logDir, 'results.log')

const getLogger = (module: NodeModule | string): Logger => {
	let path: string

	if (typeof module === 'string') {
		path = module
	} else {
		const regex = /\/|\\/i
		path = _.last(module.filename.split(regex))
	}

	return createLogger({
		level: config.loggerLevel,
		format: format.combine(
			format.label({label: path}),
			format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
			format.errors({stack: true}),
			format.splat(),
		),
		transports: [
			new transports.Console({
				format: format.combine(
					format(info => {
						info.level = info.level.toUpperCase()
						return info
					})(),
					format.colorize(),
					logFormat,
				),
			}),
			new transports.File({
				filename,
				format: format.combine(format.json()),
			}),
		],
		exitOnError: false,
	})
}

getLogger(module).info(`Logging initialized at ${config.loggerLevel} level`)

/**
 * Logger for mongoose
 */
export const mongooseLogger = (
	collectionName: any,
	method: any,
	query: any,
	doc: any,
) => {
	getLogger('moongose').debug(
		`${collectionName}.${method}: ${chalk.yellow('%o')} \n ${chalk.cyan('%o')}`,
		doc,
		query,
	)
}

/**
 * Logger stream for morgan
 */
export const morganStream: StreamOptions = {
	write(message) {
		getLogger('morgan').debug(message)
	},
}

export default getLogger
