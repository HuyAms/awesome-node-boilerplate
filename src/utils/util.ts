import uuidv4 from 'uuid/v4'
import config from '../config'

export const generateResetToken = () => {
	const resetToken = uuidv4()

	const {resetTokenExp} = config.secrets

	if (typeof resetTokenExp === 'number') {
		return {
			resetToken,
			resetTokenExp: Date.now() + resetTokenExp,
		}
	} else {
		throw Error('Invalid reset token exp')
	}
}
