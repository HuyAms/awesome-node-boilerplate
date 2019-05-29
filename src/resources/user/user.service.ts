import UserModel from './user.model'
import {User} from './user.interface'
import {UserDocument} from './user.model'
import createLogger from '../../utils/logger'
import * as _ from 'lodash'

const logger = createLogger(module)

const excludeFields = '-password -resetToken -resetTokenExp'

/**
 * Find user by id
 *
 * @param id
 */
export const findById = async (id: string): Promise<UserDocument> => {
	const user = await UserModel.findById(id)
		.select(excludeFields)
		.exec()
	return user
}

/**
 * Find many users with condition
 *
 */
export const getMany = async (): Promise<UserDocument[]> => {
	const users = await UserModel.find()
		.select(excludeFields)
		.exec()
	return users
}

/**
 * Update user
 *
 * @param id
 * @param userUpdate
 */
export const updateOne = async (
	id: string,
	userUpdate: User,
): Promise<UserDocument> => {
	logger.debug(`Update user: %o`, userUpdate)

	const user = await UserModel.findById(id).exec()

	_.merge(user, userUpdate)

	const updatedUser = await user.save()

	return updatedUser
}

/**
 * Remove user with id
 *
 * @param id
 */
export const deleteOne = async (id: string): Promise<UserDocument> => {
	const removedUser = await UserModel.findByIdAndDelete(id)
		.select(excludeFields)
		.exec()
	return removedUser
}
