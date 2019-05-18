/**
 * Send an email
 *
 */
import sgMail from '@sendgrid/mail'
import logger from './logger'
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export interface Message {
	from: string
	to: string
	subject: string
	text: string
	html?: string
}

export const sendEmail = (message: Message, callback, errorHandler) => {
	sgMail
		.send(message)
		.then(() => callback())
		.catch(error => {
			logger.debug('Error sending email', error)
			errorHandler(error)
		})
}
