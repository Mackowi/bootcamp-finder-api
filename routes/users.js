const express = require('express')
const {
  getUsers,
  getUser,
  addUser,
  updateUser,
  deleteUser,
} = require('../controllers/users')

const User = require('../models/User')

const advancedResults = require('../middleware/advancedResults')
const { protect, authorize } = require('../middleware/auth')

// to make it work between bootcamps and routers
const router = express.Router({ mergeParams: true })

router.use(protect)
router.use(authorize('admin'))

router.route('/').get(advancedResults(User), getUsers).post(addUser)

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser)

module.exports = router
