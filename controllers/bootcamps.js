const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder')
const Bootcamp = require('../models/Bootcamp.js')

// desc: get all bootcamps
// route: GET /api/vi/bootcamps
// methos: Public
const getBootcamps = asyncHandler(async (req, res, next) => {
  // copy req.query
  const reqQuery = { ...req.query }
  // fields to exclude
  const removeField = ['select', 'sort', 'page', 'limit']
  // loop ofer removeField and delete them from reqQuery
  removeField.forEach((param) => delete reqQuery[param])
  //create query string
  let queryStr = JSON.stringify(reqQuery)
  // add $ in front of operators for mongodb queries
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`)
  // creating query / finding resource
  let query = Bootcamp.find(JSON.parse(queryStr)).populate('courses')
  // adding select field to the query
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ')
    query = query.select(fields)
  }
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
    query = query.sort(sortBy)
  } else {
    query = query.sort('-createdAt')
  }
  // pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 4
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await Bootcamp.countDocuments()

  query = query.skip(startIndex).limit(limit)

  // executing query
  const bootcamps = await query

  // pagination results
  const pagination = {}

  // check if we're on the last page, if no then calculate the next page
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    }
  }

  // check if we're on the first page, if no then calculate the previous page
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    }
  }

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  })
})

// desc: get bootcamp
// route: GET /api/vi/bootcamps/:id
// methos: Public
const getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id)
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    )
  }
  res.status(200).json({ success: true, data: bootcamp })
})

// desc: create bootcamp
// route: POST /api/vi/bootcamps/:id
// methos: Private
const createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body)
  res.status(201).json({
    success: true,
    data: bootcamp,
  })
})

// desc: Update bootcamp
// route: PUT /api/vi/bootcamps/:id
// methos: Private
const updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    )
  }
  res.status(200).json({ success: true, data: bootcamp })
})

// desc: Delete bootcamp
// route: DELETE /api/vi/bootcamps/:id
// methos: Private
const deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id)
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    )
  }
  bootcamp.deleteOne()
  res.status(200).json({ success: true, data: {} })
})

// desc: Get bootcamps within a radius
// route: GET /api/vi/bootcamps/radius/:zipcode/:distance
// methos: Private
const getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params

  // get lat and lng from geocoder
  const loc = await geocoder.geocode(zipcode)
  const lat = loc[0].latitude
  const lng = loc[0].longitude

  // calculate the radius using radians
  // divide distance by radius of earth
  // Earth Radius = 6378km
  const radius = distance / 6378

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  })
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  })
})

module.exports = {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
}
