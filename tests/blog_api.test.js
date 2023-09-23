const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const Blog = require('../models/blog')

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


beforeEach(async () => {

	await Blog.deleteMany({})
	let blogObject = new Blog(blogs[0])
	await blogObject.save()
	blogObject = new Blog(blogs[1])
	await blogObject.save()
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

test('first blog is about react', async () => {
	
	const response = await api.get('/api/blogs')

	expect(response.body[0].title).toBe('React patterns')
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

afterAll(async () => {
	await mongoose.connection.close()
})
