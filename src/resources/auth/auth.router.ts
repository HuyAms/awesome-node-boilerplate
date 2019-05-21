import {Router} from 'express'
import * as authController from './auth.controller'
import {validateSignIn, validateSignUp} from './auth.validator'

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

export default router
