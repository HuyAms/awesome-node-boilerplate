/**
 * Send an email
 *
 */
import sgMail from '@sendgrid/mail'
import config from '../config/index'

const key = config.secrets.sendGrid
sgMail.setApiKey(key)

export interface Message {
	from: string
	to: string
	subject: string
	text?: string
	html?: string
	mail_settings?: object
}

export const sendEmail = (message: Message) => sgMail.send(message)
