import {Router} from 'express'
import * as authController from './auth.controller'
import {validateSignIn, validateSignUp} from './auth.validator'

const router = Router()

router.route('/signup').post(validateSignUp, authController.signup)

router.route('/signin').post(validateSignIn, authController.signin)

export default router
