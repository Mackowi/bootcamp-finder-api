const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Review = require('../models/Review.js')
const Bootcamp = require('../models/Bootcamp.js')

// desc: get reviews
// route: GET /api/vi/reviews
// route: GET /api/vi/bootcamps/:bootcampId/reviews
// method: Public
const getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId })

    if (!reviews.length) {
      return next(
        new ErrorResponse(
          `No reviews for bootcamp with the id: ${req.params.bootcampId}`,
          404
        )
      )
    }
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    })
  } else {
    res.status(200).json(res.advancedResults)
  }
})

// desc: get single reviews
// route: GET /api/vi/reviews/:id
// method: Public
const getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  })

  if (!review) {
    return next(
      new ErrorResponse(`No review with the id: ${req.params.id}`, 404)
    )
  }

  res.status(200).json({
    success: true,
    data: review,
  })
})

// desc: add  reviews
// route: POST /api/vi/bootcamps/:bootcampid/reviews
// method: private
const addReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId
  req.body.user = req.user.id

  const bootcamp = await Bootcamp.findById(req.params.bootcampId)
  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp with the id:${req.params.id}`, 404)
    )
  }

  const review = await Review.create(req.body)

  res.status(201).json({
    success: true,
    data: review,
  })
})

// desc: update reviews
// route: PUT /api/vi/reviews/:id
// method: private
const updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id)
  if (!review) {
    return next(
      new ErrorResponse(`No review with the id:${req.params.id}`, 404)
    )
  }

  // making sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to update review`, 401))
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: review,
  })
})

// desc: add  reviews
// route: POST /api/vi/bootcamps/:bootcampid/reviews
// method: private
const deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id)
  if (!review) {
    return next(
      new ErrorResponse(`No review with the id:${req.params.id}`, 404)
    )
  }

  // making sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to delete the review`, 401))
  }

  await Review.findByIdAndDelete(req.params.id)

  res.status(200).json({
    success: true,
    data: {},
  })
})

module.exports = {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview,
}
