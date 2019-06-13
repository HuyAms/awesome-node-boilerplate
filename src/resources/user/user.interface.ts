export interface User {
	firstName: string
	lastName: string
	email: string
	role?: UserRole
	status?: UserStatus
	passport: Passport
}

interface Passport {
	password?: string

	resetToken?: string
	resetTokenExp?: number

	tokenId?: string
	googleId?: string
}

export enum OathProvider {
	Google = 'google',
}

export enum UserStatus {
	Initial = 'initial',
	Active = 'active',
	Disabled = 'disabled',
}

export enum UserRole {
	Admin = 'admin',
	User = 'user',
}
