const jwt = require('jsonwebtoken')
const User = require('../models/user')

const userExtractor = async (req, res, next) => {

	if(req.token){
	
		const decodedToken = jwt.verify(req.token,
		process.env.SECRET)
		if(decodedToken.id){
			
			const user = await User.findById(decodedToken.id)

			req.user = user
		}

	}

	next()
}

module.exports = userExtractor
