import User from './user.model'
import {IUser} from './user.interface'

export const findById = async (id: string): Promise<IUser> => {
	const user = await User.findById(id)
	return user
}

export const findOne = async (conditions: any): Promise<IUser> => {
	const user = await User.findOne(conditions)
	return user
}

export const findMany = async (): Promise<IUser[]> => {
	const users = await User.find({})
	return users
}

export const create = async (userCreate: IUser): Promise<IUser> => {
	const createdUser = await User.create(userCreate)
	return createdUser
}

export const update = async (id: string, userUpdate: IUser): Promise<IUser> => {
	const updatedUser = await User.findOneAndUpdate({_id: id}, userUpdate)
	return updatedUser
}

export const remove = async (id: string): Promise<IUser> => {
	const removedUser = await User.findOneAndRemove({_id: id})
	return removedUser
}
