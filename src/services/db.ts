import mongoose from 'mongoose'
import config from '../config'
import {mongooseLogger} from '../utils/logger'

const connectDb = (url = config.dbUrl, opts = {}) => {
	mongoose.set('debug', mongooseLogger)

	return mongoose.connect(url, {...opts, useNewUrlParser: true})
}

export default connectDb
