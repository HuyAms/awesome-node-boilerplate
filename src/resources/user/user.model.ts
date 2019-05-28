import mongoose from 'mongoose'
import {IUser} from './user.interface'
import {Document} from 'mongoose'
import bcrypt from 'bcryptjs'

export interface UserDocument extends Document, IUser {
	checkPassword: (password: string) => boolean
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
			required: true,
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

const User = mongoose.model<UserDocument>('user', userSchema)

export default User
