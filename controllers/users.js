const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const User = require('../models/User.js')

// desc: get all users
// route: GET /api/v1/users
// method: Private/Admin
const getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
})

// desc: get single user
// route: GET /api/v1/users/:id
// method: Private/Admin
const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)

  res.status(200).json({
    success: true,
    data: user,
  })
})

// desc: create user
// route: POST /api/v1/users
// method: Private/Admin
const addUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body)

  res.status(201).json({
    success: true,
    data: user,
  })
})

// desc: update user
// route: PUT /api/v1/users/:id
// method: Private/Admin
const updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: user,
  })
})

// desc: delete user
// route: DELETE /api/v1/users/:id
// method: Private/Admin
const deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id)

  res.status(200).json({
    success: true,
    data: {},
  })
})

module.exports = {
  getUsers,
  getUser,
  addUser,
  updateUser,
  deleteUser,
}
