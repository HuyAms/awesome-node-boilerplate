import mongoose from 'mongoose'
import {clearDB} from './utils/db'
import connectDb from '../services/db'

beforeAll(() => {
	return connectDb()
})

beforeEach(() => {
	return clearDB()
})

afterAll(() => {
	return mongoose.disconnect()
})
