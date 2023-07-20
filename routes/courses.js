const express = require('express')
const { getCourses, getCourse, addCourse } = require('../controllers/courses')

// to make it work between bootcamps and routers
const router = express.Router({ mergeParams: true })

router.route('/').get(getCourses).post(addCourse)
router.route('/:id').get(getCourse)

module.exports = router
