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
 *    tags:
 *    - User
 *    summary: Get all users
 */
router.route('/').get(readUser, userController.getMany)

/**
 * @swagger
 *
 * /api/user/me:
 *   get:
 *    tags:
 *    - User
 *    summary: Get my profile
 */
router.route('/me').get(readUser, userController.getMe)

router.param('id', userController.params)

/**
 * @swagger
 *
 * /api/user/:id:
 *   get:
 *    tags:
 *    - User
 *    summary: Get one user
 */
router
	.route('/:id')
	.get(readUser, userController.getOne)
	.put(writeUser, validateUpdateUser(), userController.updateOne)
	.delete(writeUser, userController.deleteOne)

export default router
