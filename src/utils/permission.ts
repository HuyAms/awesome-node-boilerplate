import {UserRole} from '../resources/user/user.model'
import {checkToken} from './auth'
import * as _ from 'lodash'

export enum Permission {
	UserRead = 'user:read',
	UserWrite = 'user:write',
}

const permissionRole = {
	[UserRole.Admin]: [Permission.UserRead, Permission.UserWrite],
	[UserRole.User]: [Permission.UserRead],
}

export const getPermission = (userRole: UserRole) => {
	return permissionRole[userRole]
}

const checkPermission = (permissions?: [Permission]) => {
	return (req, res, next) => {
		const {user} = req

		if (!user) {
			return res.status(401).send({message: 'Unauthorized'})
		}

		const userPermissions = getPermission(user.role)
		const hasPermission =
			_.difference(permissions, userPermissions).length === 0

		if (!permissions || hasPermission) {
			next()
		} else {
			return res.status(401).send({message: 'Unauthorized'})
		}
	}
}

export const protect = (permissions: [Permission]) => {
	return [checkToken, checkPermission(permissions)]
}
