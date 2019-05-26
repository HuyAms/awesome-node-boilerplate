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
 *     requestBody:
 *       $ref: '#/components/requestBodies/AuthSignUp'
 *     responses:
 *       '201':
 *         $ref: '#/components/responses/TokenResponse'
 *       default:
 *         $ref: '#/components/responses/ErrorResponse'
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
 *     requestBody:
 *       $ref: '#/components/requestBodies/AuthSignIn'
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/TokenResponse'
 *       default:
 *         $ref: '#/components/responses/ErrorResponse'
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
 *     requestBody:
 *       $ref: '#/components/requestBodies/ForgotPassword'
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/MessageResponse'
 *       default:
 *         $ref: '#/components/responses/ErrorResponse'
 */
router
	.route('/password/forgot')
	.post(validateForgetPassword(), authController.forgotPassword)

/**
 * @swagger
 *
 * /auth/password/reset/{:resetToken}:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Reset user password
 *     parameters:
 *      - $ref: '#/components/parameters/resetToken'
 *     requestBody:
 *       $ref: '#/components/requestBodies/ResetPassword'
 *     responses:
 *       '201':
 *         $ref: '#/components/responses/MessageResponse'
 *       default:
 *         $ref: '#/components/responses/ErrorResponse'
 */
router
	.route('/password/reset/:resetToken')
	.post(validateResetPassword(), authController.resetPassword)

export default router
