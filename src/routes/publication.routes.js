const {Router} = require('express')

const routes = Router()

const PublicationController = require('../controllers/PublicationController')
const {showPublication, storyAndUpdatePublication, deletePublication} = require('../validations/Publication')
const middlewareAuth = require('../middlewares/auth')

routes.get('/all', PublicationController.allPublications);

routes.use(middlewareAuth)
routes.get('/', showPublication, PublicationController.show);
routes.post('/', storyAndUpdatePublication, PublicationController.store);
routes.put('/:id', storyAndUpdatePublication, PublicationController.update);
routes.delete('/:id', deletePublication, PublicationController.destroy);

module.exports = routes