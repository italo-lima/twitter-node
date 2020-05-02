const { Router } = require('express');

const accountRoutes = require('./account.routes');
const sessionRoutes = require('./session.routes');
const publicationRoutes = require('./publication.routes');
const commentRoutes = require('./comment.routes');

const routes = Router();

routes.use('/users', accountRoutes);
routes.use('/session', sessionRoutes);
routes.use('/publication', publicationRoutes);
routes.use('/comment', commentRoutes);

module.exports = routes;