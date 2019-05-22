import {Router} from 'express'
import * as authController from './auth.controller'
import {
	validateSignIn,
	validateSignUp,
	validateForgetPassword,
	validateResetPassword,
} from './auth.validator'

/**
 * @swagger
 * tags:
 * - name: Authentication
 */
const router = Router()

/**
 * @swagger
 * /auth/signup:
 *   post:
 *    tags:
 *    - Authentication
 *    summary: Sign up user
 */
router.route('/signup').post(validateSignUp(), authController.signup)

/**
 * @swagger
 * /auth/signin:
 *   post:
 *    tags:
 *    - Authentication
 *    summary: Sign in user
 */
router.route('/signin').post(validateSignIn(), authController.signin)

router
	.route('/password/forget')
	.post(validateForgetPassword(), authController.forgetPassword)

router
	.route('/password/reset/:resetToken')
	.post(validateResetPassword(), authController.resetPassword)

export default router
