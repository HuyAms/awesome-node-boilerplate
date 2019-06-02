import mongoose, {Collection} from 'mongoose'
import uuid from 'uuid/v1'
import _ from 'lodash'
import connectDb from '../services/db'
import config from '../config'

const databaseUrl = config.dbUrl

const remove = async (collection: Collection) => {
	try {
		await collection.deleteMany({})
		return Promise.resolve()
	} catch (e) {
		return Promise.reject(e)
	}
}

beforeAll(() => {
	return connectDb()
})

beforeEach(async done => {
	const db = uuid()

	const clearDB = () => {
		return Promise.all(_.map(mongoose.connection.collections, c => remove(c)))
	}

	/*
	If the mongoose connection is closed,
	start it up using the test url and database name
	*/
	const disconnectedState = 0
	if (mongoose.connection.readyState === disconnectedState) {
		try {
			await mongoose.connect(databaseUrl + db, {
				useNewUrlParser: true,
				autoIndex: true,
			})
			await clearDB()
		} catch (e) {
			console.log('connection error')
			console.error(e)
			throw e
		}
	} else {
		await clearDB()
	}
	done()
})

afterEach(async done => {
	await mongoose.connection.db.dropDatabase()
	await mongoose.disconnect()
	done()
})

afterAll(done => {
	return done()
})
