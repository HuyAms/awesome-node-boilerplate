import express from 'express'
import middlewares from './middlewares/global'
import dotenv from 'dotenv'
import config from './config'

import userRouter from './resources/user/user.router'
import authRouter from './resources/auth/auth.router'

export const app = express()

// Env variables
dotenv.config()

/**
 * Global middlewares
 */
app.use(middlewares)

/**
 * Routers
 */
app.use('/auth', authRouter)

app.use('/api/users', userRouter)

/**
 * Error Handler
 */
app.use((err, req, res, next) => {
	res.json({error: err.message})
})

/**
 * Start Express server
 */
const port = {config}

export const start = () => {
	try {
		app.listen(port, () => {
			console.log(`REST API on port ${port}`)
		})
	} catch (e) {
		console.error(e)
	}
}
