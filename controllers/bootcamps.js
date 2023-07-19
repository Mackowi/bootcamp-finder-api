const Bootcamp = require('../models/Bootcamp.js')

// desc: get all bootcamps
// route: GET /api/vi/bootcamps
// methos: Public
const getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find()
    res
      .status(200)
      .json({ success: true, count: bootcamps.length, data: bootcamps })
  } catch (error) {
    res.status(400).json({ success: false })
  }
}

// desc: get bootcamp
// route: GET /api/vi/bootcamps/:id
// methos: Public
const getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id)
    if (!bootcamp) {
      res.status(400).json({ success: false })
    }
    res.status(200).json({ success: true, data: bootcamp })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// desc: create bootcamp
// route: POST /api/vi/bootcamps/:id
// methos: Private
const createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body)
    res.status(201).json({
      success: true,
      data: bootcamp,
    })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// desc: Update bootcamp
// route: PUT /api/vi/bootcamps/:id
// methos: Private
const updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!bootcamp) {
      res.status(400).json({ success: false })
    }
    res.status(200).json({ success: true, data: bootcamp })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// desc: Delete bootcamp
// route: DELETE /api/vi/bootcamps/:id
// methos: Private
const deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
    if (!bootcamp) {
      res.status(400).json({ success: false })
    }
    res.status(200).json({ success: true, data: {} })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

module.exports = {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
}
