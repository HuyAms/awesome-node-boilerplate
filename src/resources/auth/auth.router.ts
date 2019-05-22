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
 *
 * tags:
 * - name: Authentication
 */
const router = Router()

/**
 * @swagger
 *
 * /auth/signup:
 *   post:
 *     tags:
 *     - Authentication
 *     summary: Sign up user
 */
router.route('/signup').post(validateSignUp(), authController.signup)

/**
 * @swagger
 *
 * /auth/signin:
 *   post:
 *     tags:
 *     - Authentication
 *     summary: Sign in user
 */
router.route('/signin').post(validateSignIn(), authController.signin)

/**
 * @swagger
 *
 * /auth/password/forgot:
 *   post:
 *     tags:
 *     - Authentication
 *     summary: Send user reset password link
 */
router
	.route('/password/forgot')
	.post(validateForgetPassword(), authController.forgotPassword)

/**
 * @swagger
 *
 * /auth/password/reset/:resetToken:
 *   post:
 *     tags:
 *     - Authentication
 *     summary: Reset user password
 */
router
	.route('/password/reset/:resetToken')
	.post(validateResetPassword(), authController.resetPassword)

export default router
