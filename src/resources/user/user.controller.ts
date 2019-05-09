export const getMany = (req, res) => {
	res.json('GET ALL USER')
}

export const getOne = (req, res) => {
	res.json(`GET USER WITH ID ${req.params.id}`)
}

export const createOne = (req, res) => {
	res.json('CREATE USER')
}

export const updateOne = (req, res) => {
	res.json(`UPDATE USER WITH ID ${req.params.id}`)
}

export const deleteOne = (req, res) => {
	res.json(`UPDATE USER WITH ID ${req.params.id}`)
}
