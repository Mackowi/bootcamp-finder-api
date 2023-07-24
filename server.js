const express = require('express')
const dotenv = require('dotenv').config({ path: './config/config.env' })
const morgan = require('morgan')
const colors = require('colors')
const cookieParser = require('cookie-parser')
const errorHandler = require('./middleware/error')
const connectDB = require('./config/db')
const fileupload = require('express-fileupload')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
const cors = require('cors')
const path = require('path')

const PORT = process.env.PORT || 5000

//connect to db
connectDB()

// route files
const bootcampsRoute = require('./routes/bootcamps')
const coursesRoute = require('./routes/courses')
const authRoute = require('./routes/auth')
const usersRoute = require('./routes/users')
const reviewsRoute = require('./routes/reviews')

//init
const app = express()

// body parser
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// cookie parses
app.use(cookieParser())

// logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}
// fileupload
app.use(fileupload())
// sanitize data - prevents sql injections
app.use(mongoSanitize())
// set security headers
app.use(helmet())
// prevent xss attacks
app.use(xss())
// rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
})
app.use(limiter)
// prevent http param polution
app.use(hpp())
// enable CORS
app.use(cors())

// set static folder
app.use(express.static(path.join(__dirname, 'public')))

// mount routes
app.use('/api/v1/bootcamps', bootcampsRoute)
app.use('/api/v1/courses', coursesRoute)
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/users', usersRoute)
app.use('/api/v1/reviews', reviewsRoute)

// error middleware
app.use(errorHandler)

const server = app.listen(
  PORT,
  console.log(
    `\n\nServer running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
      .bold
  )
)

// handle unhandled promise rejection (mongodb related)
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red)
  // close server and exit
  server.close(() => process.exit(1))
})
