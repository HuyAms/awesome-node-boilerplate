import {Router} from 'express'
import * as userController from './user.controller'
import {Permission, protect} from '../../middlewares/permission'
import {validateUpdateUser} from './user.validator'

const router = Router()

const writeUser = protect([Permission.UserWrite])
const readUser = protect([Permission.UserRead])

router.route('/').get(readUser, userController.getMany)

router.route('/me').get(readUser, userController.getMe)

router
	.route('/:id')
	.get(readUser, userController.getOne)
	.put(writeUser, validateUpdateUser(), userController.updateOne)
	.delete(writeUser, userController.deleteOne)

export default router
