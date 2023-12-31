const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder')
const Bootcamp = require('../models/Bootcamp.js')
const path = require('path')

// desc: get all bootcamps
// route: GET /api/v1/bootcamps
// method: Public
const getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
})

// desc: get bootcamp
// route: GET /api/v1/bootcamps/:id
// method: Public
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
// route: POST /api/v1/bootcamps/:id
// method: Private
const createBootcamp = asyncHandler(async (req, res, next) => {
  // add user to req.body
  req.body.user = req.user

  // check for published bootcamp
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id })

  // if the user is not an admin they can only add one bootcamp

  if (publishedBootcamp && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user with id ${req.user.id} has already published a bootcamp`,
        400
      )
    )
  }

  const bootcamp = await Bootcamp.create(req.body)

  res.status(201).json({
    success: true,
    data: bootcamp,
  })
})

// desc: Update bootcamp
// route: PUT /api/v1/bootcamps/:id
// method: Private
const updateBootcamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id)
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    )
  }
  // make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.name} is not authorized to update this bootcamp`,
        401
      )
    )
  }
  bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  res.status(200).json({ success: true, data: bootcamp })
})

// desc: Delete bootcamp
// route: DELETE /api/v1/bootcamps/:id
// method: Private
const deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id)
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    )
  }
  // make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.name} is not authorized to delete this bootcamp`,
        401
      )
    )
  }
  bootcamp.deleteOne()
  res.status(200).json({ success: true, data: {} })
})

// desc: Get bootcamps within a radius
// route: GET /api/v1/bootcamps/radius/:zipcode/:distance
// method: Private
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

// desc: Upload photo for bootcamp
// route: PUT /api/v1/bootcamps/:id/photo
// method: Private
const bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id)
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    )
  }
  // make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.name} is not authorized to update this bootcamp`,
        401
      )
    )
  }
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a image file`, 400))
  }
  const file = req.files.file
  // make sure the file is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400))
  }
  // check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}b`,
        400
      )
    )
  }
  // create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err)
      new ErrorResponse(`Problem with file upload`, 500)
    }
    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name })
    res.status(200).json({
      success: true,
      data: file.name,
    })
  })
})

module.exports = {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
}
