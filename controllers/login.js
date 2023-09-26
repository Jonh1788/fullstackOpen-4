const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')


loginRouter.post('/', async (req, res) => {

	const { username, password } = req.body

	const user = await User.findOne({ username })
	console.log(user)
	const passwordCorrect = user === null 
	? false
	: await bcrypt.compare(password, user.passwordHash)

	if(!(user && passwordCorrect)) {
		return res.status(401).json({
			error:'Invalid username or password'})
	}

	return res.status(201).end()

	
})

module.exports = loginRouter
