import {Router} from 'express'
import * as authController from './auth.controller'

const router = Router()

router.route('/signup').post(authController.signup)

router.route('/signin').post(authController.signin)

router.route('/password/forget').post(authController.forgetPassword)

export default router
