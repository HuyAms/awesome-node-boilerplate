export const config = {
	seed: false,
	loggerLevel: process.env.LOGGER_LEVEL || 'info',
	mailSender: process.env.MAIL_SENDER,
	dbUrl: process.env.DATABASE_URL,
}

export default config
