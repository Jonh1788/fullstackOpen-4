const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user")
const jwt = require("jsonwebtoken")


blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
		name:1, 
		id:1,
		username:1})
  return response.json(blogs);
});

blogRouter.post("/", async (request, response) => {

	
	if(!request.user){
		return response.status(401).send({error:'Invalid token'})
	}

	

	const blog = new Blog({...request.body, user:request.user._id})

	const savedBlog = await blog.save()

	request.user.blogs = request.user.blogs.concat(savedBlog._id)
	await request.user.save()

	return response.status(201).json(savedBlog)
});

blogRouter.delete("/:id", async (req, res) => {
	
	if(!req.user){
		return res.status(401).json({error:'Invalid token'})
	}
	
	const blog = await Blog.findById(req.params.id)
	if(req.user._id.toString() === blog.user.toString()){

		await Blog.findByIdAndDelete(req.params.id)
		return res.status(204).end()
	}
	console.log(typeof(req.user._id))
	return res.status(401).json({error:'Only creator can erase a blog'})
})

blogRouter.put("/:id", async (req, res) => {

	const { author, title, url, likes } = req.body

	await Blog.findByIdAndUpdate(req.params.id,
	{ author, title, url, likes }, {new: true, runValidators:true, context:'query'})

	return res.status(204).end()
})

module.exports = blogRouter;
