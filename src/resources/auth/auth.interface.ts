import {User, UserRole} from '../user/user.interface'

/**
 * @swagger
 *
 * definitions:
 *   UserSignUp:
 *     type: object
 *     properties:
 *       firstName:
 *         type: string
 *         minLength: 2
 *         example: Eaton
 *       lastName:
 *         type: string
 *         minLength: 2
 *         example: Jake
 *       email:
 *         type: string
 *         example: test@gmail.com
 *         format: email
 *       password:
 *         type: string
 *         minLength: 5
 *         format: password
 *         example: 123456
 *       role:
 *         $ref: '#/definitions/UserRole'
 *         example: user
 *     required:
 *       - firstName
 *       - lastName
 *       - email
 *       - password
 */
export interface UserSignUp extends User {
	firstName: string
	lastName: string
	email: string
	password: string
	role: UserRole
}
