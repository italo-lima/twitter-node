const Publication = require('../models/Publication')

class PublicationController{

  async allPublications(req, res) {

    try {

      const allPublications = await Publication.find(
        {},
        {},
        { sort: { createdAt: -1 }}
        ).populate({
          path: 'comments',
          select: 'comment_description'
        })

      return res.json(allPublications)

    } catch {
      return res.status(500).json({err : "Error Listing Publications"})
    }
  }

  async show(req, res) {
    const authHeader = req.headers.idUser

    try {

      const publications = await Publication.find({owner_user: authHeader})

      return res.json(publications)

    } catch {
      return res.status(500).json({err : "Error Listing Publication"})
    }
  }

  async store(req, res) {
    const {description} = req.body
    const authHeader = req.headers.idUser

    try {

      const publication = await Publication.create({description, owner_user: authHeader})

      return res.json(publication)

    } catch {
      return res.status(500).json({err : "Error Creating Publication"})
    }
  }

  async update(req, res) {
    const authHeader = req.headers.idUser;
    const {id} = req.params
    const {description} = req.body

    try {

      const publication = await Publication.findById(id)

      if(!publication){
        return res.status(401).json({err : "Publication not found"})
      }

      if(publication.owner_user != authHeader){
        return res.status(401).json({err : "You cannot edit other user's posts"})
      }

      publication.description = description;

      await publication.save();

      return res.json(publication)
    } catch {
      return res.status(500).json({err : "Error Listing Publication or ID invalid"})
    }
  }

  async destroy(req, res) {
    const authHeader = req.headers.idUser;
    const {id} = req.params

    try {
      const publication = await Publication.findById(id)

      if(!publication){
        return res.status(401).json({err : "Publication not found"})
      }

      if(publication.owner_user != authHeader){
        return res.status(401).json({err : "You cannot delete other user's posts"})
      }

      await publication.remove()

      return res.status(204).send()
    } catch {
      return res.status(500).json({err : "Error Listing Publication"})
    }
  }
}

module.exports = new PublicationController()