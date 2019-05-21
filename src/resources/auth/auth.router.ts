import {Router} from 'express'
import * as authController from './auth.controller'
import {validateSignIn, validateSignUp} from './auth.validator'

const router = Router()

/**
 * @swagger
 * tags:
 * - name: Authentication
 */

/**
 * @swagger
 * /signup:
 *   post:
 *    tags:
 *    - Authentication
 *    summary: Sign up user
 *    parameters:
 *    - in: body
 *    required: true
 */
router.route('/signup').post(validateSignUp(), authController.signup)

router.route('/signin').post(validateSignIn(), authController.signin)

export default router
