import {Router} from 'express'
import * as userController from './user.controller'
import {Permission, protect} from '../../middlewares/permission'
import {validateUpdateUser} from './user.validator'

/**
 * @swagger
 *
 * tags:
 * - name: User
 */
const router = Router()

const writeUser = protect([Permission.UserWrite])
const readUser = protect([Permission.UserRead])

/**
 * @swagger
 *
 * /api/user:
 *   get:
 *     tags:
 *       - User
 *     summary: Get all users
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/TokenResponse'
 *       default:
 *         $ref: '#/components/responses/ErrorResponse'
 */
router.route('/').get(readUser, userController.getMany)

/**
 * @swagger
 *
 * /api/user/me:
 *   get:
 *     tags:
 *       - User
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
 * /api/user/{:id}:
 *   parameters:
 *     - $ref: '#/components/parameters/id'
 */
router.param('id', userController.params)

router
	.route('/:id')

	/**
	 * @swagger
	 *
	 * /api/user/{:id}:
	 *   get:
	 *     tags:
	 *       - User
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
	 * /api/user/{:id}:
	 *   put:
	 *     tags:
	 *       - User
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
	 * /api/user/{:id}:
	 *   delete:
	 *     tags:
	 *       - User
	 *     summary: Delete one user
	 *     responses:
	 *       '200':
	 *         $ref: '#/components/responses/UserResponse'
	 *       default:
	 *         $ref: '#/components/responses/ErrorResponse'
	 */
	.delete(writeUser, userController.deleteOne)

export default router
