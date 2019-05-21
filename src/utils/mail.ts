/**
 * Send an email
 *
 */
import sgMail from '@sendgrid/mail'
import createLogger from './logger'
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const logger = createLogger(module)

export interface Message {
	from: string
	to: string
	subject: string
	text: string
	html?: string
}

export const sendEmail = (message: Message, callback: any) => {
	sgMail
		.send(message)
		.then(() => callback(null))
		.catch(error => {
			logger.debug('Error sending email', error)
			callback(error)
		})
}
