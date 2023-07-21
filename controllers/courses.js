const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Course = require('../models/Course.js')
const Bootcamp = require('../models/Bootcamp.js')

// desc: get courses
// route: GET /api/vi/courses
// route: GET /api/vi/bootcamps/:bootcampId/courses
// method: Public
const getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId })

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    })
  } else {
    res.status(200).json(res.advancedResults)
  }
})

// desc: get single course
// route: GET /api/vi/courses/:id
// method: Public
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
// method: Private
const addCourse = asyncHandler(async (req, res, next) => {
  // assigning bootcampId param to req body so during creation the needed bootcampId is there
  req.body.bootcamp = req.params.bootcampId
  // add user to req.body
  req.body.user = req.user

  const bootcamp = await Bootcamp.findById(req.params.bootcampId)
  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp with id: ${req.params.bootcampId}`, 404)
    )
  }

  // make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.name} is not authorized to add a course to bootcamp ${bootcamp._id}`,
        401
      )
    )
  }

  const course = await Course.create(req.body)

  res.status(200).json({
    success: true,
    data: course,
  })
})

// desc: update course
// route: PUT /api/vi/courses/:id
// method: Private
const updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id)
  if (!course) {
    return next(new ErrorResponse(`No course with id: ${req.params.id}`, 404))
  }

  // make sure user is bootcamp owner
  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.name} is not authorized to update course ${course._id}`,
        401
      )
    )
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: course,
  })
})

// desc: delete course
// route: DELETE /api/vi/courses/:id
// method: Private
const deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id)
  if (!course) {
    return next(new ErrorResponse(`No course with id: ${req.params.id}`, 404))
  }

  // make sure user is bootcamp owner
  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.name} is not authorized to delete course ${course._id}`,
        401
      )
    )
  }

  await Course.deleteOne(course)

  res.status(200).json({
    success: true,
    data: {},
  })
})

module.exports = {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
}
