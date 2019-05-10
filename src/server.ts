import express from 'express'
import {json, urlencoded} from 'body-parser'
import morgan from 'morgan'
import cors from 'cors'

// Router
import userRouter from './resources/user/user.router'

export const app = express()

// Global middlewares
app.use(cors())
app.use(json())
app.use(urlencoded({extended: true}))
app.use(morgan('dev'))

// Resource routers
app.use('/api/users', userRouter)

app.get('/', (req, res, next) => {
	res.json('Welcome to Awesome Node Boilerplate')
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
