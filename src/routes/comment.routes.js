const {Router} = require('express')

const routes = Router()

const CommentController = require('../controllers/CommentController')
const {createComment, putAndDeleteComment,showPublication} = require('../validations/Comment')
const authMiddleware = require('../middlewares/auth')

routes.use(authMiddleware)
routes.get('/', showPublication, CommentController.show);
routes.get('/my-comments', showPublication, CommentController.index);
routes.post('/', createComment, CommentController.store);
routes.put('/:id', putAndDeleteComment, CommentController.update);
routes.delete('/:id', putAndDeleteComment, CommentController.destroy);

module.exports = routes;