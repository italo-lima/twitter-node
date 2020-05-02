const { Router } = require('express')

const SessionController = require('../controllers/SessionController')

const routes = Router()

routes.post('/', SessionController.store)

module.exports = routes