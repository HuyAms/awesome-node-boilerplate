import UserModel, {UserDocument} from './user.model'
import {User} from './user.interface'
import createLogger from '../../utils/logger'
import apiError from '../../utils/apiError'
import * as _ from 'lodash'
import {Sort} from '../../middlewares/validator'

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

	if (!user) {
		return Promise.reject(apiError.notFound('Cannot find user with that id'))
	}

	return Promise.resolve(user)
}

/**
 * Find many users with condition
 *
 */
export const getMany = async (
	field?: string,
	sort: Sort = Sort.asc,
): Promise<UserDocument[]> => {
	const query = UserModel.find().select(excludeFields)

	if (field) {
		const sortValue = sort === Sort.asc ? 1 : -1
		query.sort({[field]: sortValue})
	}

	const users = await query.exec()

	return Promise.resolve(users)
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

	if (!user) {
		return Promise.reject(apiError.notFound('Cannot find user with that id'))
	}

	_.merge(user, userUpdate)

	const updatedUser = await user.save()

	return Promise.resolve(updatedUser)
}

/**
 * @param id
 */
export const deleteOne = async (id: string): Promise<UserDocument> => {
	const removedUser = await UserModel.findByIdAndDelete(id)
		.select(excludeFields)
		.exec()
	return Promise.resolve(removedUser)
}
