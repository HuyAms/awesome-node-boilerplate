import UserModel, {UserDocument} from './user.model'
import {User} from './user.interface'
import createLogger from '../../utils/logger'
import apiError from '../../utils/apiError'
import {Sort} from '../../middlewares/validator'

const logger = createLogger(module)

const excludeFields = '-password -resetToken -resetTokenExp'

/**
 * Find user by id
 *
 * @param id
 */
export const getUserById = async (id: string): Promise<UserDocument> => {
	const user = await UserModel.findById(id)
		.select(excludeFields)
		.exec()

	if (!user) {
		return Promise.reject(apiError.notFound('Cannot find user with that id'))
	}

	return user
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

	const updatedUser = await UserModel.findByIdAndUpdate(id, userUpdate, {
		new: true,
	}).exec()

	if (!updatedUser) {
		return Promise.reject(apiError.notFound('Cannot find user with that id'))
	}

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

	if (!removedUser) {
		return Promise.reject(apiError.notFound('Cannot find user with that id'))
	}

	return removedUser
}
