const blogRouter = require("express").Router();
const Blog = require("../models/blog");

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  return response.json(blogs);
});

blogRouter.post("/", async (request, response) => {
  const blog = new Blog(request.body);

    const blogResult = await blog.save();
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
