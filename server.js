const express = require('express')
const dotenv = require('dotenv').config({ path: './config/config.env' })
const morgan = require('morgan')
const colors = require('colors')
const connectDB = require('./config/db')

const PORT = process.env.PORT || 5000

//connect to db
connectDB()

// route files
const bootcampsRoute = require('./routes/bootcamps')

const app = express()

// body parser
app.use(express.json())
// logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// mount routes
app.use('/api/v1/bootcamps', bootcampsRoute)

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
)

// handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red)
  // close server and exit
  server.close(() => process.exit(1))
})
