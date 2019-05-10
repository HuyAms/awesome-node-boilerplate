import express from 'express'
import {json, urlencoded} from 'body-parser'
import morgan from 'morgan'
import cors from 'cors'
import protect from './utils/auth'

import userRouter from './resources/user/user.router'
import authRouter from './resources/auth/auth.router'

export const app = express()

// Global Middlewares
app.use(cors())
app.use(json())
app.use(urlencoded({extended: true}))
app.use(morgan('dev'))

// Routers
app.use('/auth', protect.optional, authRouter)

app.use('/api/users', protect.required, userRouter)

// Error handling
app.use((err, req, res, next) => {
	res.json({error: err.message})
})

export const start = () => {
	try {
		app.listen(3000, () => {
			console.log(`REST API on http://localhost:3000`)
		})
	} catch (e) {
		console.error(e)
	}
}
