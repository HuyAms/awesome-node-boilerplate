import {Router} from 'express'
import {json, urlencoded} from 'body-parser'
import morgan from 'morgan'
import cors from 'cors'

const router = Router()

router.use(cors())
router.use(json())
router.use(urlencoded({extended: true}))
router.use(morgan('dev'))

export default router
