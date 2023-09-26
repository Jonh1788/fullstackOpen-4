const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const hmJWT = require('../utils/hmJWT')


loginRouter.post('/', async (req, res) => {

	const { username, password } = req.body

	const user = await User.findOne({ username })
	const passwordCorrect = user === null 
	? false
	: await bcrypt.compare(password, user.passwordHash)

	if(!(user && passwordCorrect)) {
		return res.status(401).json({
			error:'Invalid username or password'})
	}

	const userAuthenticate = {

		username: user.username,
		id: user._id
	}

	const token = hmJWT.sign(userAuthenticate, process.env.SECRET)

	return res.status(201).json({ token })

	
})


loginRouter.post('/verify', async (req, res) => {
	const { token } = req.body

	const user = hmJWT.verify(token, process.env.SECRET)

	return res.status(200).json({user})
})

module.exports = loginRouter
