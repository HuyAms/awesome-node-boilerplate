import {Router} from 'express'
import * as userController from './user.controller'
import {Permission, protect} from '../../middlewares/permission'
import {validateUpdateUser} from './user.validator'

/**
 * @swagger
 *
 * tags:
 * - name: UserModel
 */
const router = Router()

const writeUser = protect([Permission.UserWrite])
const readUser = protect([Permission.UserRead])

/**
 * @swagger
 *
 * /api/users:
 *   get:
 *     tags:
 *       - UserModel
 *     summary: Get all users
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/UsersResponse'
 *       default:
 *         $ref: '#/components/responses/ErrorResponse'
 */
router.route('/').get(userController.getMany)

/**
 * @swagger
 *
 * /api/users/me:
 *   get:
 *     tags:
 *       - UserModel
 *     summary: Get my profile
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/UserResponse'
 *       default:
 *         $ref: '#/components/responses/ErrorResponse'
 */
router.route('/me').get(readUser, userController.getMe)

/**
 * @swagger
 *
 * /api/users/{id}:
 *   parameters:
 *     - $ref: '#/components/parameters/id'
 */
router.param('id', userController.params)

router
	.route('/:id')

	/**
	 * @swagger
	 *
	 * /api/users/{id}:
	 *   get:
	 *     tags:
	 *       - UserModel
	 *     summary: Get one user
	 *     responses:
	 *       '200':
	 *         $ref: '#/components/responses/UserResponse'
	 *       default:
	 *         $ref: '#/components/responses/ErrorResponse'
	 */
	.get(readUser, userController.getOne)

	/**
	 * @swagger
	 *
	 * /api/users/{id}:
	 *   put:
	 *     tags:
	 *       - UserModel
	 *     summary: Update one user
	 *     requestBody:
	 *       $ref: '#/components/requestBodies/UserUpdate'
	 *     responses:
	 *       '201':
	 *         $ref: '#/components/responses/UserResponse'
	 *       default:
	 *         $ref: '#/components/responses/ErrorResponse'
	 */
	.put(writeUser, validateUpdateUser(), userController.updateOne)

	/**
	 * @swagger
	 *
	 * /api/users/{id}:
	 *   delete:
	 *     tags:
	 *       - UserModel
	 *     summary: Delete one user
	 *     responses:
	 *       '200':
	 *         $ref: '#/components/responses/UserResponse'
	 *       default:
	 *         $ref: '#/components/responses/ErrorResponse'
	 */
	.delete(writeUser, userController.deleteOne)

export default router
