const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user")


blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
		name:1, 
		id:1,
		username:1})
  return response.json(blogs);
});

blogRouter.post("/", async (request, response) => {
    const user = await User.find({})
    const blogWithUser = request.body
    blogWithUser.user = user[0].id
    const blog = new Blog(blogWithUser);
    const blogResult = await blog.save();
    
  await User.findByIdAndUpdate(user[0].id, 
		{ name: user[0].name, 
		  username: user[0].username,  
		blogs: user[0].blogs.concat(blogResult.id)}, 
		{ new: true, 
		runValidators: true,
		context:'query' })
    response.status(201).json(blogResult);

});

blogRouter.delete("/:id", async (req, res) => {
	
	
	await Blog.findByIdAndDelete(req.params.id)
	return res.status(204).end()
	
})

blogRouter.put("/:id", async (req, res) => {

	const { author, title, url, likes } = req.body

	await Blog.findByIdAndUpdate(req.params.id,
	{ author, title, url, likes }, {new: true, runValidators:true, context:'query'})

	return res.status(204).end()
})

module.exports = blogRouter;
