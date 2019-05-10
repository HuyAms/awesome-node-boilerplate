import express from 'express'
import {json, urlencoded} from 'body-parser'
import morgan from 'morgan'
import cors from 'cors'

// Router
import userRouter from './resources/user/user.router'
import authRouter from './resources/auth/auth.router'

export const app = express()

// Global middlewares
app.use(cors())
app.use(json())
app.use(urlencoded({extended: true}))
app.use(morgan('dev'))

// Resource routers
app.use('/auth', authRouter)

app.use('/api/users', userRouter)

export const start = () => {
	try {
		app.listen(3000, () => {
			console.log(`REST API on http://localhost:3000`)
		})
	} catch (e) {
		console.error(e)
	}
}
