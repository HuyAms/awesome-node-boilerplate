import User from './user.model'
import {IUser} from './user.interface'

/**
 * Find user by id
 *
 * @param id
 */
export const findById = async (id: string): Promise<IUser> => {
	const user = await User.findById(id)
	return user
}

/**
 * Find one user with condition
 *
 * @param conditions
 */
export const findOne = async (conditions: any): Promise<IUser> => {
	const user = await User.findOne(conditions)
	return user
}

/**
 * Find many users with condition
 *
 * @param conditions
 */
export const findMany = async (conditions: any): Promise<IUser[]> => {
	const users = await User.find(conditions)
	return users
}

/**
 * Create user
 *
 * @param userCreate
 */
export const create = async (userCreate: IUser): Promise<IUser> => {
	const createdUser = await User.create(userCreate)
	return createdUser
}

/**
 * Update user
 *
 * @param id
 * @param userUpdate
 */
export const update = async (id: string, userUpdate: IUser): Promise<IUser> => {
	const updatedUser = await User.findOneAndUpdate({_id: id}, userUpdate)
	return updatedUser
}

/**
 * Remove user with id
 *
 * @param id
 */
export const remove = async (id: string): Promise<IUser> => {
	const removedUser = await User.findOneAndRemove({_id: id})
	return removedUser
}
