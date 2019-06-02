import request from 'supertest'
import {app} from '../../server'
import {enumToValues} from '../../utils/util'
import {UserRole} from '../../resources/user/user.interface'
import {Permission, permissionRole} from '../../middlewares/permission'
import {UserDocument} from '../../resources/user/user.model'
import {newToken} from '../../utils/auth'
import _ from 'lodash'
import {Sort} from '../../middlewares/validator'

export const apiRequest = request(app)

/**
 * Mock login user then return token
 *
 * @param user
 */
export const siginUser = (user: UserDocument) => {
	return `Bearer ${newToken(user)}`
}

/**
 * Get all user roles that includes permission
 *
 * @param permission
 */
export const getRolesWithPermisison = (permission: Permission) => {
	const userRoles = enumToValues(UserRole) as UserRole[]
	return userRoles.filter(role => {
		const permissions = permissionRole[role]
		return permissions.includes(permission)
	})
}

/**
 * Get all user roles does not include permisson
 *
 * @param permission
 */
export const getRolesWithoutPermission = (permission: Permission) => {
	const userRoles = enumToValues(UserRole) as UserRole[]
	return userRoles.filter((role: UserRole) => {
		const permissions = permissionRole[role]
		return !permissions.includes(permission)
	})
}

/**
 * Sort array by field
 *
 * @param array
 * @param field
 * @param sort
 */
export const sortArrayByField = (array: any[], field: string, sort: Sort) => {
	return _.orderBy(array, [field], [sort])
}
