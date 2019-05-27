import {Router} from 'express'
import {json, urlencoded} from 'body-parser'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import validator from 'express-validator'
import {morganStream} from '../utils/logger'
import {limitRequest} from '../utils/requestLimiter'

const router = Router()

/**
 * Global middlewares
 */
router.use(cors())
router.use(json())
router.use(urlencoded({extended: true}))
router.use(morgan('dev', {stream: morganStream}))
router.use(validator())
router.use(helmet())
router.use(limitRequest())

export default router
