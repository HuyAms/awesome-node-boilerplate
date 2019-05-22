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

/**
 * @swagger
 *
 * definitions:
 *   UserRole:
 *     type: string
 *     enum:
 *       - admin
 *       - user
 */
export enum UserRole {
	Admin = 'admin',
	User = 'user',
}
