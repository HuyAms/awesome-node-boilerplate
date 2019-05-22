import {User, UserRole} from '../user/user.interface'

export interface UserSignUp extends User {
	firstName: string
	lastName: string
	email: string
	password: string
	role: UserRole
	time: string
}
