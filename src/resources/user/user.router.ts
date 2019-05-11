import {Router} from 'express'
import * as userController from './user.controller'
import {Permission, protect} from '../../utils/permission'

const router = Router()

const writeUser = protect([Permission.UserWrite])
const readUser = protect([Permission.UserRead])

router.route('/').get(readUser, userController.getMany)

router
	.route('/:id')
	.get(readUser, userController.getOne)
	.put(writeUser, userController.updateOne)
	.delete(writeUser, userController.deleteOne)

export default router
