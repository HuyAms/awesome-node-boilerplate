/**
 * Send an email
 *
 */
import _ from 'lodash'
import sgMail from '@sendgrid/mail'
import config from '../config/index'

sgMail.setApiKey(config.secrets.sendGridApiKey)

export interface Message {
	from: string
	to: string
	subject: string
	text?: string
	html?: string
}

export const sendEmail = (message: Message) => {
	let emailMessage = message

	if (config.isTest) {
		const mailSettings = {
			sandboxMode: {
				enabled: true,
			},
		}

		emailMessage = _.merge(message, mailSettings)
	}

	const result = sgMail.send(emailMessage)

	return result
}
