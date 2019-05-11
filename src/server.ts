import express from 'express'
import {json, urlencoded} from 'body-parser'
import morgan from 'morgan'
import cors from 'cors'
import protect from './utils/auth'
import dotenv from 'dotenv'

// Config
import config from './config'

import userRouter from './resources/user/user.router'
import authRouter from './resources/auth/auth.router'

export const app = express()

// Env variables
dotenv.config()

// Global Middlewares
app.use(cors())
app.use(json())
app.use(urlencoded({extended: true}))
app.use(morgan('dev'))

// Routers
app.use('/auth', authRouter)

app.use('/api/users', protect, userRouter)

// Error handling
app.use((err, req, res, next) => {
	res.json({error: err.message})
})

const port = config.port
export const start = () => {
	try {
		app.listen(port, () => {
			console.log(`REST API on port ${port}`)
		})
	} catch (e) {
		console.error(e)
	}
}
