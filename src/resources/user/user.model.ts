export default interface UserModel {
	id: number
	firstName: string
	lastName: string
	email: string
	password: string
	role: UserRole
}

export enum UserRole {
	Admin = 'admin',
	User = 'user',
}