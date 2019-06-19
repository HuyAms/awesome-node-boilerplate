import _ from 'lodash'
import {NextFunction, Request, RequestHandler, Response} from 'express'
import {checkToken} from './auth'
import {UserRole, UserStatus} from '../resources/user/user.interface'
import apiError, {ErrorCode} from '../utils/apiError'

/**
 * Declare user's permissions
 */
export enum Permission {
	UserRead = 'user:read',
	UserWrite = 'user:write',
}

type PermissionRole = {[key in UserRole]: Permission[]}

export const permissionRole: PermissionRole = {
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
			return next(
				apiError.forbidden(
					'User has no permission to perform this action',
					ErrorCode.notHasPermission,
				),
			)
		}
	}
}

/**
 * Middleware to check user's status
 *
 * @param permissions
 */
export const checkUserStatus: RequestHandler = (req, res, next) => {
	const {user} = req

	if (!user) {
		return next(apiError.unauthorized())
	}

	if (user.status === UserStatus.Active) {
		return next()
	} else {
		return next(
			apiError.forbidden(
				'User has not been activated',
				ErrorCode.notActiveUser,
			),
		)
	}
}

/**
 * Middleware to check user's token then permissions
 *
 * @param permissions
 */
export const protect = (permissions: [Permission]) => {
	return [checkToken(), checkUserStatus, checkPermission(permissions)]
}
