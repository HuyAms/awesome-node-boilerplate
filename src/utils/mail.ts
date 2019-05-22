/**
 * Send an email
 *
 */
import sgMail from '@sendgrid/mail'
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export interface Message {
	from: string
	to: string
	subject: string
	text: string
	html?: string
}

export const sendEmail = (message: Message) => sgMail.send(message)
