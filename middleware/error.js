const ErrorResponse = require('../utils/errorResponse')

const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message

  // log for dev
  console.log(
    '\n--------------------' + err.name.bold.red + '--------------------\n'
  )
  console.log(err)

  // mongoose wrong objectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`
    error = new ErrorResponse(message, 404)
  }

  // mongoose duplicate key
  if (err.code === 11000) {
    const message = `Duplicate field value entered. Field: ${
      Object.keys(error.keyValue)[0]
    }`
    error = new ErrorResponse(message, 400)
  }

  // mongoose validation error
  if (err.name === 'ValidationError') {
    console.log(err.errors)
    const message = Object.values(err.errors).map((val) => val.message)
    error = new ErrorResponse(message, 400)
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  })
}

module.exports = errorHandler
