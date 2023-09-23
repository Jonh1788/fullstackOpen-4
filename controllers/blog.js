const blogRouter = require("express").Router();
const Blog = require("../models/blog");

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  return response.json(blogs);
});

blogRouter.post("/", async (request, response) => {
  const blog = new Blog(request.body);

  try {
    const blogResult = await blog.save();
    response.status(201).json(blogResult);
  } catch (err) {
    next(err);
  }
});

module.exports = blogRouter;
