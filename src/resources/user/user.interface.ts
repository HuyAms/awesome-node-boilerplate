export interface User {
	id: number
	firstName: string
	lastName: string
	email: string
	password: string
	role: UserRole
	resetPasswordToken?: string
	resetPasswordExp?: number
}

export enum UserRole {
	Admin = 'admin',
	User = 'user',
}
