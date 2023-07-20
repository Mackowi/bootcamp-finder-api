const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Course = require('../models/Course.js')
const Bootcamp = require('../models/Bootcamp.js')

// desc: get courses
// route: GET /api/vi/courses
// route: GET /api/vi/bootcamps/:bootcampId/courses
// methos: Public
const getCourses = asyncHandler(async (req, res, next) => {
  let query

  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId })
  } else {
    query = Course.find().populate({
      path: 'bootcamp',
      select: 'name description',
    })
  }

  const courses = await query

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  })
})

// desc: get single course
// route: GET /api/vi/courses/:id
// methos: Public
const getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  })
  if (!course) {
    return next(new ErrorResponse(`No course with id: ${req.params.id}`, 404))
  }
  res.status(200).json({
    success: true,
    data: course,
  })
})

// desc: add course
// route: Post /api/vi/bootcamps/:bootcampId/courses
// methos: Private
const addCourse = asyncHandler(async (req, res, next) => {
  // assigning bootcampId param to req body so during creation the needed bootcampId is there
  req.body.bootcamp = req.params.bootcampId

  const bootcamp = await Bootcamp.findById(req.params.bootcampId)
  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp with id: ${req.params.bootcampId}`, 404)
    )
  }

  const course = await Course.create(req.body)

  res.status(200).json({
    success: true,
    data: course,
  })
})

module.exports = { getCourses, getCourse, addCourse }
