import mongoose from 'mongoose'
import config from '../config'
import {mongooseLogger} from '../utils/logger'

const connectDb = (url = config.dbUrl, opts = {}) => {
	if (config.isDev) {
		mongoose.set('debug', mongooseLogger)
	}

	return mongoose.connect(url, {
		...opts,
		useNewUrlParser: true,
		useCreateIndex: true,
	})
}

export default connectDb
