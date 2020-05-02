const { Router } = require('express')

//Controllers
const UserController = require('../controllers/UserController')

//Validations
const {userPost, userUpdate, userDestroy, userShow} = require('../validations/User')

//Middleware
const middlewareAuth = require('../middlewares/auth')

const routes = Router()

routes.post('/', userPost, UserController.store)
routes.use(middlewareAuth)
routes.get('/', userShow, UserController.show)
routes.put('/', userUpdate, UserController.update)
routes.delete('/', userDestroy, UserController.destroy)

module.exports = routes