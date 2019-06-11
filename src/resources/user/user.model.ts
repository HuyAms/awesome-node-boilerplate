import mongoose from 'mongoose'
import {User} from './user.interface'
import {Document} from 'mongoose'
import bcrypt from 'bcryptjs'
import uuid from 'uuid/v4'

export interface UserDocument extends Document, User {
	checkPassword: (password: string) => boolean

	clearResetToken: () => void

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
		password: {
			type: String,
			minlength: 5,
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
		resetToken: String,
		resetTokenExp: Date,
		tokenId: String,

		googleId: String,
	},
	{timestamps: true},
)

/**
 * Password hash middleware.
 */
userSchema.pre<UserDocument>('save', function(next) {
	if (!this.isModified('password')) {
		return next()
	}

	const salt = bcrypt.genSaltSync(10)
	this.password = bcrypt.hashSync(this.password, salt)

	this.revokeOldToken()

	next()
})

/**
 * Check user's password
 *
 * @param plainPassword
 */
userSchema.methods.checkPassword = function(plainPassword: string) {
	const hashPassword = this.password

	return bcrypt.compareSync(plainPassword, hashPassword)
}

userSchema.methods.clearResetToken = function() {
	this.resetToken = null
	this.resetTokenExp = null
}

userSchema.methods.revokeOldToken = function() {
	this.tokenId = uuid()
}

const UserModel = mongoose.model<UserDocument>('user', userSchema)

export default UserModel
