import UserModel from '../resources/user/user.model'

const users: UserModel[] = []
let id = 0

export const createUser = (user: UserModel) => {
	const email = user.email

	id += 1
	user.id = id

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

export const saveUser = (user: UserModel) => {
	const {email} = user
	let replacedIndex
	const userExist = users.some((user, index) => {
		if (user.email === email) {
			replacedIndex = index
			return true
		}
	})

	if (userExist) {
		users.splice(replacedIndex, 1, user)
		return Promise.resolve(user)
	} else {
		return Promise.reject(new Error('Cannot save user to the database'))
	}
}
