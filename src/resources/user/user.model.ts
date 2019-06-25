import mongoose, {Document} from 'mongoose'
import {OathProvider, User} from './user.interface'
import bcrypt from 'bcryptjs'
import uuid from 'uuid/v4'

export interface UserDocument extends Document, User {
	checkPassword: (password: string) => boolean

	clearResetToken: () => void

	unlinkOathProvider: (provider: OathProvider) => void

	revokeOldToken: () => void
}

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		firstName: {
			type: String,
			required: true,
			minlength: 2,
		},
		lastName: {
			type: String,
			required: true,
			minlength: 2,
		},
		role: {
			type: String,
			required: true,
			enum: ['admin', 'user'],
			default: 'user',
		},
		status: {
			type: String,
			required: true,
			enum: ['initial', 'active', 'disabled'],
			default: 'initial',
		},

		passport: {
			password: {
				type: String,
				minlength: 5,
			},

			tokenId: String,
			googleId: String,

			resetToken: String,
			resetTokenExp: Date,
		},
	},
	{timestamps: true},
)

/**
 * Password hash middleware.
 */
userSchema.pre<UserDocument>('save', function(next) {
	if (!this.isModified('passport password')) {
		return next()
	}

	const salt = bcrypt.genSaltSync(10)
	this.passport.password = bcrypt.hashSync(this.passport.password, salt)

	this.revokeOldToken()

	next()
})

/**
 * Check user's password
 *
 * @param plainPassword
 */
userSchema.methods.checkPassword = function(plainPassword: string) {
	const hashPassword = this.passport.password

	return bcrypt.compareSync(plainPassword, hashPassword)
}

userSchema.methods.clearResetToken = function() {
	this.passport.resetToken = null
	this.passport.resetTokenExp = null
}

userSchema.methods.unlinkOathProvider = function(provider: OathProvider) {
	switch (provider) {
		case OathProvider.Google:
			this.passport.googleId = null
			break
		default:
			break
	}
}

userSchema.methods.revokeOldToken = function() {
	this.passport.tokenId = uuid()
}

const UserModel = mongoose.model<UserDocument>('user', userSchema)

export default UserModel
