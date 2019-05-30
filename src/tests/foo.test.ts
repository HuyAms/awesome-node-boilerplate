const add = (a: number, b: number) => a + b

describe('Foo test', () => {
	it('add', () => {
		const a = 1
		const b = 2
		const result = 3
		expect(add(a, b)).toEqual(result)
	})
})
