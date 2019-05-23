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
 *       description: User to sign up
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserSignUp'
 *     responses:
 *       '200':
 *         description: Sign in successfully
 *       '400':
 *         $ref: "#/components/responses/BadRequest"
 *       '500':
 *         $ref: "#/components/responses/InternalServer"
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
 *       description: User to sign in
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserSignIn'
 *     responses:
 *       '200':
 *         description: Sign in successfully
 *       '400':
 *         $ref: "#/components/responses/BadRequest"
 *       '401':
 *         $ref: "#/components/responses/Unauthorized"
 *       '500':
 *         $ref: "#/components/responses/InternalServer"
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
 *       description: Email to receive reset password link
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *             required:
 *               - email
 *     responses:
 *       '200':
 *         description: Successfully send reset password link to user's email
 *       '400':
 *         $ref: "#/components/responses/BadRequest"
 *       '500':
 *         $ref: "#/components/responses/InternalServer"
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
 *       - in: path
 *         name: resetToken
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           description: User's reset password token
 *     requestBody:
 *       description: New password to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 5
 *               passwordConfirmation:
 *                 type: string
 *                 format: password
 *                 minLength: 5
 *             required:
 *               - email
 *     responses:
 *       '200':
 *         description: Successfully send reset password link to user's email
 *       '400':
 *         $ref: "#/components/responses/BadRequest"
 *       '500':
 *         $ref: "#/components/responses/InternalServer"
 */
router
	.route('/password/reset/:resetToken')
	.post(validateResetPassword(), authController.resetPassword)

export default router
