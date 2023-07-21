const advancedResults = (model, populate) => async (req, res, next) => {
  let query
  // copy req.query
  const reqQuery = { ...req.query }
  // fields to exclude
  const removeField = ['select', 'sort', 'page', 'limit']
  // loop ofer removeField and delete them from reqQuery
  removeField.forEach((param) => delete reqQuery[param])
  //create query string
  console.log(reqQuery)
  let queryStr = JSON.stringify(reqQuery)
  // add $ in front of operators for mongodb queries
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`)
  // creating query / finding resource
  query = model.find(JSON.parse(queryStr))
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
  const total = await model.countDocuments()

  query = query.skip(startIndex).limit(limit)

  if (populate) {
    query = query.populate(populate)
  }

  // executing query
  const results = await query

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

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  }

  next()
}

module.exports = advancedResults
