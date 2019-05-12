import * as _ from 'lodash'
import {checkToken} from './auth'
import {UserRole} from '../resources/user/user.model'
import error from '../utils/apiError'

/**
 * Declare user's permissions
 */
export enum Permission {
	UserRead = 'user:read',
	UserWrite = 'user:write',
}

const permissionRole = {
	[UserRole.Admin]: [Permission.UserRead, Permission.UserWrite],
	[UserRole.User]: [Permission.UserRead],
}

/**
 * Middleware to check user's permissions
 *
 * @param permissions
 */
const checkPermission = (permissions?: [Permission]) => {
	return (req, res, next) => {
		const {user} = req

		if (!user) {
			return next(error.unauthorized())
		}

		const userPermissions = permissionRole[user.role]
		const hasPermission =
			_.difference(permissions, userPermissions).length === 0

		if (hasPermission) {
			return next()
		} else {
			return next(error.unauthorized())
		}
	}
}

/**
 * Middleware to check user's token then permissions
 *
 * @param permissions
 */
export const protect = (permissions: [Permission]) => {
	return [checkToken, checkPermission(permissions)]
}
