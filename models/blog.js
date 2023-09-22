const mongoose = require('mongoose')
const config = require('../utils/config')

mongoose.set('strictQuery', false)
mongoose.connect(config.MONGODB_URI)

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

blogSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id
		delete returnedObject._id
		delete returnedObject.__v
	}
})

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog
