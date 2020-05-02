const {celebrate, Joi, Segments} = require('celebrate')

module.exports = {
  userShow: celebrate({
    [Segments.HEADERS]: Joi.object({
      idUser: Joi.string().required()
    }).unknown()
  }),
  userPost: celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
      password: Joi.string().min(6).required(),
      email: Joi.string().email().required()
    })
   }),
   userUpdate: celebrate({
    [Segments.HEADERS]: Joi.object({
      idUser: Joi.string().required()
    }).unknown(),
    [Segments.BODY]: Joi.object({
      name: Joi.string(),
      email: Joi.string().email(),
      oldPassword: Joi.string().min(6),
      password: Joi.string().min(6)
    })
   }),
   userDestroy: celebrate({
    [Segments.HEADERS]: Joi.object({
      idUser: Joi.string().required()
    }).unknown()
  })
}