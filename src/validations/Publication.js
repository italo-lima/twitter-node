const { celebrate, Segments, Joi } = require('celebrate')

module.exports = {
  showPublication: celebrate({
    [Segments.HEADERS]: Joi.object({
      idUser: Joi.string().required()
    }).unknown()
  }),
  storyAndUpdatePublication: celebrate({
    [Segments.BODY]: Joi.object({
      description: Joi.string().required()
    }),
    [Segments.HEADERS]: Joi.object({
      idUser: Joi.string().required()
    }).unknown()
  }),
  deletePublication: celebrate({
    [Segments.HEADERS]: Joi.object({
      idUser: Joi.string().required()
    }).unknown()
  })
}