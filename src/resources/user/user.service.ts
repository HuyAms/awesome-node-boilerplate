import UserModel, {UserDocument} from './user.model'
import {User} from './user.interface'
import createLogger from '../../utils/logger'
import apiError from '../../utils/apiError'
import * as _ from 'lodash'
import {Sort} from '../../middlewares/validator'

const logger = createLogger(module)

const excludeFields = '-passport'

interface PaginationRecords<T> {
	total: number
	count: number
	records: T[]
}

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

	return Promise.resolve(user)
}

/**
 * Find many users with condition
 *
 */
export const getMany = async ({
	field = '',
	sort = Sort.asc,
	search = '',
	offset = 0,
	limit = 20,
}): Promise<PaginationRecords<UserDocument>> => {
	const query = UserModel.find().select(excludeFields)

	if (field) {
		query.sort({[field]: sort})
	}

	query
		.skip(offset)
		.limit(limit)
		.lean()

	if (search) {
		const searchRegex = new RegExp(`^${search}`, 'i')

		query.or([
			{firstName: {$regex: searchRegex, $options: 'i'}},
			{lastName: {$regex: searchRegex, $options: 'i'}},
			{email: {$regex: searchRegex, $options: 'i'}},
		])
	}

	const CountQuery = query.toConstructor()
	const countQuery = new CountQuery()

	const [records, count, total] = await Promise.all([
		query.exec(),
		countQuery.countDocuments().exec(),
		UserModel.countDocuments(),
	])

	return Promise.resolve({count, total, records})
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

	if (!removedUser) {
		return Promise.reject(apiError.notFound('Cannot find user with that id'))
	}

	return Promise.resolve(removedUser)
}
