const config = {
	seed: false,
	loggerLevel: process.env.LOGGER_LEVEL || 'info',
	mailSender: process.env.MAIL_SENDER,
	requestLimiter: {
		defaultTimeLimit: process.env.DEFAULT_TIME_LIMIT || 15 * 60 * 1000, // 15 minutes
		defaultAmountLimit: process.env.DEFAULT_AMOUNT_LIMIT || 100,
		authAmountLimit: process.env.DEFAULT_AUTH_AMOUNT_LIMIT || 50,
	},
}

export default config
