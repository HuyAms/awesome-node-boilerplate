import * as _ from 'lodash'
import {Request, Response, NextFunction} from 'express'
import {checkToken} from './auth'
import {UserRole} from '../resources/user/user.model'
import apiError from '../utils/apiError'

/**
 * Declare user's permissions
 */
export enum Permission {
	UserRead = 'user:read',
	UserWrite = 'user:write',
}

type PermissionRole = {[key in UserRole]: Permission[]}

const permissionRole: PermissionRole = {
	[UserRole.Admin]: [Permission.UserRead, Permission.UserWrite],
	[UserRole.User]: [Permission.UserRead],
}

/**
 * Middleware to check user's permissions
 *
 * @param permissions
 */
const checkPermission = (permissions?: [Permission]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const {user} = req

		if (!user) {
			return next(apiError.unauthorized())
		}

		const userPermissions = permissionRole[user.role as UserRole]
		const hasPermission =
			_.difference(permissions, userPermissions).length === 0

		if (hasPermission) {
			return next()
		} else {
			return next(apiError.unauthorized())
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
