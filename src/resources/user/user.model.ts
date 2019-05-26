import mongoose from 'mongoose'

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
		},

		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
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

export const User = mongoose.model('user', userSchema)
