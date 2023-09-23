const mongoose = require('mongoose')
const config = require('../utils/config')

mongoose.set('strictQuery', false)
mongoose.connect(config.MONGODB_URI)

const blogSchema = new mongoose.Schema({
  title: {
		type: String,
		required: true
	},
  author: String,
  url: {
		type: String,
		required: true
	},
  likes: {
		type: Number,
		default: 0
	}
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
