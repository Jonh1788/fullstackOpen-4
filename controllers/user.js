const userRoute = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

userRoute.get('/', async (req, res) => {

	const users = await User.find({}).populate('blogs', 
		{user:0})
	.select({ passwordHash: 0 })
	return res.json(users)
})

userRoute.post('/', async (req, res) => {

	const { username, name, password } = req.body

	if(!username){
		return res.status(401).send({error:"Username is missing"})
	}

	if(!password){
		return res.status(401).send({error:"Password is missing"})
	}

	if(username.length < 4){
		return res.status(401).send({error:"Username must be greater than 3 character"})
	}

	if(password.length < 4){
		return res.status(401).send({error:"Password must be greater than 3 character"})
	}



	const saltRound = 10
	const passwordHash = await bcrypt.hash(password, saltRound)
	const user = new User({
		username,
		name,
		passwordHash
	})

	const savedUser = await user.save()

	res.status(201).json(savedUser)

})


module.exports = userRoute
