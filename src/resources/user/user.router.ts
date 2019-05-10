import {Router} from 'express'
import * as userController from './user.controller'

const router = Router()

// api/users
router
	.route('/')
	.get(userController.getMany)
	.post(userController.createOne)

// api/users/:id
router
	.route('/:id')
	.get(userController.getOne)
	.put(userController.updateOne)
	.delete(userController.deleteOne)

export default router
