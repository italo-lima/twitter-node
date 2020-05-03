const Publication = require('../models/Publication')
const ErrorApi = require('../errors')

class PublicationController{

  async allPublications(req, res) {

      const allPublications = await Publication.find(
        {},
        {},
        { sort: { createdAt: -1 }}
        ).populate({
          path: 'comments',
          select: 'comment_description'
        })

      return res.json(allPublications)
  }

  async show(req, res) {
    const authHeader = req.headers.idUser

      const publications = await Publication.find({owner_user: authHeader})

      return res.json(publications)
  }

  async store(req, res) {
    const {description} = req.body
    const authHeader = req.headers.idUser

    const publication = await Publication.create({description, owner_user: authHeader})

    return res.json(publication)
  }

  async update(req, res) {
    const authHeader = req.headers.idUser;
    const {id} = req.params
    const {description} = req.body

    const publication = await Publication.findById(id)

    if(!publication){
      throw new ErrorApi("Publication not found", 404)
    }

    if(publication.owner_user != authHeader){
      throw new ErrorApi("You cannot edit other user's posts")
    }

    publication.description = description;

    await publication.save();

    return res.json(publication)

  }

  async destroy(req, res) {
    const authHeader = req.headers.idUser;
    const {id} = req.params

    const publication = await Publication.findById(id)

    if(!publication){
      throw new ErrorApi("Publication not found", 404)
    }

    if(publication.owner_user != authHeader){
      throw new ErrorApi("You cannot delete other user's posts")
    }

    await publication.remove()

    return res.status(204).send()
  }
}

module.exports = new PublicationController()