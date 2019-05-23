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
 *       - Authentication
 *     summary: Sign up user
 */
router.route('/signup').post(validateSignUp(), authController.signup)

/**
 * @swagger
 *
 * /auth/signin:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Sign in user
 */
router.route('/signin').post(validateSignIn(), authController.signin)

/**
 * @swagger
 *
 * /auth/password/forgot:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Send user reset password link
 *     responses:
 *       200:
 *         description: Successfully send reset password link to user's email
 *       400:
 *         description: Not found user email
 *         schema:
 *           $ref: "#/definitions/ErrorResponse"
 *         example:
 *           status: 200
 *           errorCode: 1
 *           errorMessage: 123
 *       500:
 *         description: Unexpected server error
 *         schema:
 *           $ref: "#/definitions/ErrorResponse"
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
 *       - Authentication
 *     summary: Reset user password
 *     responses:
 *       200:
 *         description: Successfully send reset password link to user's email
 *       400:
 *         description: Not found user email
 *       500:
 *         description: Unexpected server error
 */
router
	.route('/password/reset/:resetToken')
	.post(validateResetPassword(), authController.resetPassword)

export default router
