import {Router} from 'express'
import {json, urlencoded} from 'body-parser'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import validator from 'express-validator'
import rateLimit from 'express-rate-limit'
import {morganStream} from '../utils/logger'
import config from '../config'
import {validateCommonQueries} from './validator'

const router = Router()

// Time and amount limit of requests to the API
const {timeLimit, amountLimit} = config.requestLimiter

/**
 * Global middlewares
 */
router.use(cors())
router.use(json())
router.use(urlencoded({extended: true}))
router.use(morgan('dev', {stream: morganStream}))
router.use(validator())
router.use(validateCommonQueries())
router.use(helmet())
router.use(
	rateLimit({
		windowMs: timeLimit,
		max: amountLimit,
	}),
)

export default router
