import express from 'express'
import middlewares from './middlewares/global'
import userRouter from './resources/user/user.router'
import authRouter from './resources/auth/auth.router'

export const app = express()

// Global Middlewares
app.use(middlewares)

// Routers
app.use('/auth', authRouter)

app.use('/api/users', userRouter)

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
