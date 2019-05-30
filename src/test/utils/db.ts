import {User} from '../../resources/user/user.interface'
import UserModel, {UserDocument} from '../../resources/user/user.model'
import mongoose, {Collection} from 'mongoose'
import * as _ from 'lodash'

const remove = (collection: Collection) => {
	collection.remove((err: Error) => {
		if (err) return Promise.reject(err)
		return Promise.resolve()
	})
}

export const clearDB = () => {
	return Promise.all(_.map(mongoose.connection.collections, c => remove(c)))
}

export const createUser = (user: User): Promise<UserDocument> => {
	const newUser = new UserModel(user)
	return newUser.save()
}
