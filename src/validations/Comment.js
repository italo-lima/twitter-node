const { Joi, celebrate, Segments } = require('celebrate')

module.exports = {
  showPublication: celebrate({
    [Segments.HEADERS]: Joi.object({
      idUser: Joi.string().required()
    }).unknown()
  }),
  createComment: celebrate({
    [Segments.HEADERS]: Joi.object({
      idUser: Joi.string().required()
    }).unknown(),
    [Segments.BODY]: Joi.object({
      comment_description: Joi.string().required()
    }),
    [Segments.QUERY]: Joi.object({
      publicationID: Joi.string().required()
    })
    }),
    putAndDeleteComment: celebrate({
      [Segments.HEADERS]: Joi.object({
        idUser: Joi.string().required()
      }).unknown(),
      [Segments.PARAMS]: Joi.object({
        id: Joi.string().required()
      })
    })
}