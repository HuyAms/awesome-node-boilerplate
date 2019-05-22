/**
 * Send an email
 *
 */
import sgMail from '@sendgrid/mail'
import config from '../config'

sgMail.setApiKey(config.apiKeys.sendGrid)

export interface Message {
	from: string
	to: string
	subject: string
	text: string
	html?: string
}

export const sendEmail = (message: Message) => sgMail.send(message)
