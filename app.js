const express = require('express')
const app = express()
const cors = require('cors')
const blogRouter = require('./controllers/blog')
const errorHandler = require('./middlewares/errorHandler')
app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogRouter)
app.use(errorHandler)


module.exports = app
