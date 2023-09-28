const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const Blog = require('../models/blog')
const User = require('../models/user')
const api = supertest(app)

const blogs = [

  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },

  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  }

]

const user = {

	username:"test",
	name:"test",
	password:"test"
}

let token = ""


beforeEach(async () => {

	await Blog.deleteMany({})

	const blogObjects = blogs.map(blog => new Blog(blog))
	const blogPromises = blogObjects.map(blog => blog.save())
	await Promise.all(blogPromises)

	await User.deleteMany({})

	await api.post('/api/users').send(user)
	const response = await api
		.post('/api/login')
		.send({
			username:user.username, 
			password:user.password})
	token = response.body.token


})

test('blogs are returned as JSON', async () =>{
	
	await api
	.get('/api/blogs')
	.expect(200)
	.expect('Content-Type', /application\/json/)
}, 100000)


test('returned two blogs', async () => {
	
	const response = await api.get('/api/blogs')
	
	expect(response.body).toHaveLength(2)

}, 100000)


test('returned blogs have id', async () => {
	
	const response = await api.get('/api/blogs')

	expect(response.body[0].id).toBeDefined()
}, 100000)

test('a valid blog can be added', async () => {
	
	const newBlog = {

		author:'Aline',
		title:'Uma vida feliz',
		url:'example.com'
		
	}
	
	await api
	.post('/api/blogs')
	.send(newBlog)
	.set({authorization:`Bearer ${token}`})
	.expect(201)
	.expect('Content-Type', /application\/json/)

	const response = await api.get('/api/blogs')
	const contents = response.body.map(result => result.author)

	expect(response.body).toHaveLength(blogs.length + 1)
	expect(contents).toContain('Aline')
})

test('like property is present', async () => {


	const newBlog = {
		author:'Aline',
		title:'Uma vida feliz',
		url:'example.com'
		
	}

	await api
	.post('/api/blogs')
	.send(newBlog)
	.set({authorization:`Bearer ${token}`})
	.expect(201)
	.expect('Content-Type', /application\/json/)

	const response = await api.get('/api/blogs')

	expect(response.body[response.body.length - 1].likes).toBeDefined()
	

})

describe('title and url', () => {

	test('title is present', async () => {
		await api
		.get('/api/blogs')
		.expect(200)
		.expect('Content-Type', /application\/json/)
		

	const response = await api.get('/api/blogs')

	expect(response.body[response.body.length - 1].title).toBeDefined()
	
		
	})



	test('url is present', async () => {
		await api
		.get('/api/blogs')
		.expect(200)
		.expect('Content-Type', /application\/json/)
		

	const response = await api.get('/api/blogs')

	expect(response.body[response.body.length - 1].url).toBeDefined()
	
		
	})
})


describe('deletion blog', () => {
	
	test('delete is not a sucess without a valid id',
	async () => {
		
		await api.delete('/api/blogs/7').expect(401)

	}, 100000)

	test('deletion is a sucess with a valid id', 
	async () => {


	const newBlog = {
		author:'Aline',
		title:'Uma vida feliz',
		url:'example.com'
		
	}

	const savedBlog = await api
	.post('/api/blogs')
	.send(newBlog)
	.set({authorization:`Bearer ${token}`})
	.expect(201)
	.expect('Content-Type', /application\/json/)
	
		let lengthBefore = await Blog.find({})

		await api
			.delete(`/api/blogs/${savedBlog.body.id}`)
			.set({authorization:`Bearer ${token}`})
			.expect(204)

		const newBlogs = await Blog.find({})
		expect(newBlogs).toHaveLength(lengthBefore.length-1)
	} )
})

describe('update a blog', () => {

	test('is updated', async () => {

		const array = await Blog.find({})

		const newObject = {
			title: array[0].title, 
			author: 'Jonathan',
			url: array[0].url,
			likes: array[0].likes,
		}

		await api
		.put(`/api/blogs/${array[0].id}`)
		.send(newObject)
		.expect(204)

		const modified = await Blog.findById(array[0].id)
		expect(modified.author).toBe('Jonathan')

		
	})
})

it('dont cant add a blog without token', async () => {

	const newBlog = {
		author:'Aline',
		title:'Uma vida feliz',
		url:'example.com'
		
	}

	await api
	.post('/api/blogs')
	.send(newBlog)
	.expect(401)
	
})
afterAll(async () => {
	await mongoose.connection.close()
})
