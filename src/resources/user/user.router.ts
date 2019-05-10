import {Router} from 'express'
import * as userController from './user.controller'

const router = Router()

router
	.route('/')
	.get(userController.getMany)
	.post(userController.createOne)

router
	.route('/:id')
	.get(userController.getOne)
	.put(userController.updateOne)
	.delete(userController.deleteOne)

export default router
