const { Router } = require('express')

const SessionController = require('../controllers/SessionController')
const {sessionCreate} = require('../validations/Session')

const routes = Router()

routes.post('/', sessionCreate, SessionController.store)

module.exports = routes