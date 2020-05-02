require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : ".env"
})

const express = require('express')
const routes = require('./routes/index')
const {errors} = require('celebrate')
const database = require("./config/database")

const app = express()

app.use(express.json())
app.use(routes)
app.use(errors())

module.exports = app