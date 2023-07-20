const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv').config({ path: './config/config.env' })

//load models
const Bootcamp = require('./models/Bootcamp')

//connect to db
mongoose.connect(process.env.MONGO_URI)

// read json files
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
)

//import into db
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps)
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