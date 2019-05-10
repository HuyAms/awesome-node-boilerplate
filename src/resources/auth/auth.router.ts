import {Router} from 'express'
import * as authController from './auth.controller'

const router = Router()

router.route('/signup').post(authController.signup)

router.route('/signin').post(authController.signin)

export default router
