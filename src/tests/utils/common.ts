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
 * Find one user with role and sign in
 *
 * @param users
 * @param role
 */
export const findUserWithRoleAndSignIn = (
	users: UserDocument[],
	role: UserRole,
) => {
	const user = users.find(user => user.role === role)
	const token = siginUser(user)
	return {token, user}
}

/**
 * Get one user role that includes permission
 *
 * @param permission
 */
export const getRoleWithPermisison = (permission: Permission) => {
	const userRoles = enumToValues(UserRole) as UserRole[]
	return userRoles.find(role => {
		const permissions = permissionRole[role]
		return permissions.includes(permission)
	})
}

/**
 * Get one user role does not include permission
 *
 * @param permission
 */
export const getRoleWithoutPermission = (permission: Permission) => {
	const userRoles = enumToValues(UserRole) as UserRole[]
	return userRoles.find((role: UserRole) => {
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

/**
 * @param array
 * @param field
 * @param search
 */
export const filterArrayBySearchText = (
	array: any[],
	searchFields: string[],
	searchText: string,
) => {
	const searchRegex = new RegExp(`^${searchText}`, 'i')

	return array.filter(element => {
		searchFields.forEach(field => {
			const fieldValue = element[field]

			return fieldValue.match(searchRegex)
		})
	})
}

export const getRecordsWithPagination = (
	array: any[],
	offset: number = 0,
	limit: number,
) => {
	const end = offset + limit + 1
	return array.slice(offset, end)
}
