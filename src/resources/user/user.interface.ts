export interface User {
	firstName: string
	lastName: string
	email: string
	password?: string
	role?: UserRole
	status?: UserStatus
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
