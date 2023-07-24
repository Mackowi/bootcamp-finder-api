const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv').config({ path: './config/config.env' })

//load models
const Bootcamp = require('./models/Bootcamp')
const Course = require('./models/Course')
const User = require('./models/User')
const Review = require('./models/Review')

//connect to db
mongoose.connect(process.env.MONGO_URI)

// read bootcamp json files
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
)
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
)
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
)
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8')
)

//import into db
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps)
    await Course.create(courses)
    await User.create(users)
    await Review.create(reviews)
    console.log('Data imported!'.green.inverse)
    process.exit()
  } catch (error) {
    console.log(error)
  }
}

//delete data from db
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany()
    await Course.deleteMany()
    await User.deleteMany()
    await Review.deleteMany()
    console.log('Data deleted!'.red.inverse)
    process.exit()
  } catch (error) {
    console.log(error)
  }
}

// argument based action
if (process.argv[2] === '-import') {
  importData()
} else if (process.argv[2] === '-delete') {
  deleteData()
}
