import express from 'express'
import middlewares from './middlewares/global'
import userRouter from './resources/user/user.router'
import authRouter from './resources/auth/auth.router'
import logger from './utils/logger'

export const app = express()

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
export const start = () => {
	try {
		app.listen(3000, () => {
			logger.info(`REST API on http://localhost:3000`)
		})
	} catch (e) {
		logger.error(e.message)
	}
}
