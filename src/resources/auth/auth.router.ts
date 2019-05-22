import {Router} from 'express'
import * as authController from './auth.controller'
import {
	validateSignIn,
	validateSignUp,
	validateForgetPassword,
	validateResetPassword,
} from './auth.validator'

const router = Router()

router.route('/signup').post(validateSignUp(), authController.signup)

router.route('/signin').post(validateSignIn(), authController.signin)

router
	.route('/password/forget')
	.post(validateForgetPassword(), authController.forgetPassword)

router
	.route('/password/reset/:resetToken')
	.post(validateResetPassword(), authController.resetPassword)

export default router
