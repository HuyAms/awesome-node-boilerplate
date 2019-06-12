import {permissionRole} from '../../middlewares/permission'

describe('[Permission]', () => {
	it('permission role', () => {
		expect(permissionRole).toMatchSnapshot()
	})
})
