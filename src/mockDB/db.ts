import UserModel from '../resources/user/user.model'

const users: UserModel[] = []
const id = 0

export const createUser = (user: UserModel) => {
	const email = user.email

	user.id = id + 1

	const emailExist = users.some(user => user.email === email)

	if (!emailExist) {
		users.push(user)
		return Promise.resolve(user)
	}

	return Promise.reject(new Error('Email has been already exits'))
}

export const findAllUser = () => {
	return Promise.resolve(users)
}

export const findUserWithEmail = (email: string) => {
	const user = users.find(user => user.email === email)

	if (user) {
		return Promise.resolve(user)
	}

	return Promise.reject(new Error('Cannot find user with that email'))
}

export const findUserWithId = (id: number) => {
	const user = users.find(user => user.id === id)

	if (user) {
		return Promise.resolve(user)
	}

	return Promise.reject(new Error('Cannot find user with that id'))
}
