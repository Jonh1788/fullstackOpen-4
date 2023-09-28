const express = require('express')
const app = express()
require('express-async-errors')
const cors = require('cors')
const blogRouter = require('./controllers/blog')
const userRouter = require('./controllers/user')
const loginRouter = require('./controllers/login')
const errorHandler = require('./middlewares/errorHandler')
const mongoose = require('mongoose')
const config = require('./utils/config')
const tokenExtractor = require('./middlewares/tokenExtractor')
const userExtractor = require('./middlewares/userExtractor')


mongoose.set('strictQuery', false)
mongoose.connect(config.MONGODB_URI)

app.use(cors())
app.use(express.json())
app.use(tokenExtractor)
app.use('/api/blogs',userExtractor ,blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login' ,loginRouter)
app.use(errorHandler)


module.exports = app
