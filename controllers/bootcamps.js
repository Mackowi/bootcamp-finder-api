// desc: get all bootcamps
// route: GET /api/vi/bootcamps
// methos: Public
const getBootcamps = (req, res, next) => {
  res.status(200).json({ message: 'Show all bootcamps' })
}

// desc: get bootcamp
// route: GET /api/vi/bootcamps/:id
// methos: Public
const getBootcamp = (req, res, next) => {
  res.status(200).json({ message: 'Show specific bootcamps' })
}

// desc: create bootcamp
// route: POST /api/vi/bootcamps/:id
// methos: Private
const createBootcamp = (req, res, next) => {
  res.status(200).json({ message: 'Create new bootcamp' })
}

// desc: Update bootcamp
// route: PUT /api/vi/bootcamps/:id
// methos: Private
const updateBootcamp = (req, res, next) => {
  res.status(200).json({ message: `Update bootcamp ${req.params.id}` })
}

// desc: Delete bootcamp
// route: DELETE /api/vi/bootcamps/:id
// methos: Private
const deleteBootcamp = (req, res, next) => {
  res.status(200).json({ message: `Delete bootcamp ${req.params.id}` })
}

module.exports = {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
}
