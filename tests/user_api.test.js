const mongoose = require('mongoose')
const supertest = require('supertest')
const User = require('../models/user')
const app = require('../app')

const api = supertest(app)


const users = [
	{
		username:'DrIntelect',
		name:'Jonathan',
		password:'1222222'
	},

	{
		username:'Manhattan',
		name:'Icaro',
		password:'9999999'
	},

]

beforeEach(async () => {

	await User.deleteMany({})

	const callUsers = users.map(u => new User(u))
	const promisesUsers = callUsers.map(u => u.save())
	await Promise.all(promisesUsers)
})

describe('get users', () => {

	test('users returned a json', async () => {
		await api
		.get('/api/users')
		.expect(200)
		.expect('Content-Type', /application\/json/)
	})

	test('returned two entries on users', async () => {
		
		const response = await api.get('/api/users')

		expect(response.body).toHaveLength(2)
	})

	test('username and name is present', async () => {

		const response = await api.get('/api/users')

		expect(response.body[0].name).toBeDefined()
		expect(response.body[0].username).toBeDefined()
	})

	test('name Jonathan is present', async () => {

		const response = await api.get('/api/users')

		const names = response.body.map(u => u.name)

		expect(names).toContain('Jonathan')
	})

})


describe('post users', () => {

	const user = {
		name: "Enzo",
		username: "Linguinha",
		password: "202020"
	}

	test('when user be added return 201', async () => {
		
		await api
		.post('/api/users')
		.send(user)
		.expect(201)
	})

	test('user can be added', async () => {

		const usersBefore = await User.find({})

		await api
		.post('/api/users')
		.send(user)
		.expect(201)

		const userAfter = await User.find({})

		expect(userAfter).toHaveLength(usersBefore.length + 1)
	})

	test('users have a passwordHash', async () => {

		const response = await api
			.post('/api/users')
			.send(user)
			.expect(201)

		expect(response.body.passwordHash).toBeDefined()
	})

})

describe('post user error', () => {

	const userWithoutPassword = {
		name:"ui",
		username:"p",
	}


	test('must be return status code 401', async () => {
		await api
		.post('/api/users')
		.send(userWithoutPassword)
		.expect(401)
	})

	test('must be return missing password', async () => {
		
		const newUser = userWithoutPassword
		newUser.username = "Josue"
		const response = await api.post('/api/users')
		.send(newUser)
		.expect(401)

		expect(response.body.error).toBe("Password is missing")
	})

	test('must be return missing username', async () => {

		const newUser = userWithoutPassword
		newUser.username = null
		const response = await api.post('/api/users')
		.send(newUser)
		.expect(401)

		expect(response.body.error).toBe("Username is missing")
	})

	test('must be return username len error', async () =>{

		const newUser = userWithoutPassword
		newUser.username = "jos"
		newUser.password = "123"
		const response = await api.post('/api/users')
		.send(newUser)
		.expect(401)

		expect(response.body.error).toBe("Username must be greater than 3 character")

	})

	test('must be return password len error', async () =>{

		const newUser = userWithoutPassword
		newUser.username = "josyu"
		newUser.password = "123"
		const response = await api.post('/api/users')
		.send(newUser)
		.expect(401)

		expect(response.body.error).toBe("Password must be greater than 3 character")

	})

	test('cannot be add a user with same username', 
	async () => {

	const user = {
		name: "Enzo",
		username: "Linguinha",
		password: "202020"
	}

			await api
			.post('/api/users')
			.send(user)
			.expect(201)


			await api
			.post('/api/users')
			.send(user)
			.expect(400)

			
	})
})

describe('login', () => {

			const newUser = {

				username:"DrIntelecto",
				password:"33333"
			}

	test('should be return error with incorrect parameters',
	async () => {


			await api
			.post('/api/users')
			.send(newUser)
			.expect(201)
			
			
			const response = await api
			.post('/api/login')
			.send({...newUser, password:"74747"})
			expect(response.body.error).toBe("Invalid username or password")

	}, 100000)

	test('should be return sucess on correct credentials',
	async () => {

			await api
			.post('/api/users')
			.send(newUser)
			.expect(201)

			await api
			.post('/api/login')
			.send(newUser)
			.expect(201)
	})
})

afterAll(async () => {
	await mongoose.connection.close()
})
