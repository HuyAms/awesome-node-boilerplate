export interface IUser {
	readonly id: string
	firstName: string
	lastName: string
	email: string
	password: string
	role: UserRole
	resetToken?: string
	resetTokenExp?: number
	status: UserStatus
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
