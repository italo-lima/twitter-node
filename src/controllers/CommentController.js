const Comment = require('../models/Comment')
const Publication = require('../models/Publication')
const User = require('../models/User')

class CommentController {

  async index(req, res) {
    const authHeader = req.headers.idUser

    try {
      const comments = await Publication.find({ owner_user: {"$nin": authHeader}}, "description")
        .populate({
          path: "comments",
          match: {user_comment: authHeader}
        }) 
         
        const commentsFilter = comments.filter(({comments}) => comments.length > 0)

        return res.json(commentsFilter)

    } catch {
      return res.status(500).json({err : "Error Listing Comments"})
    }
  }

  async show(req, res) {
    const authHeader = req.headers.idUser

    try {
      const comments = await Publication.find({owner_user: authHeader}, "description")
        .populate({
          path: 'comments'
        })

      return res.json(comments)

    } catch {
      return res.status(500).json({err : "Error Listing Comments"})
    }
  }

  async store(req, res) {
    const authHeader = req.headers.idUser
    const {publicationID} = req.query
    const { comment_description } = req.body

    try {

      const publication = await Publication.findById(publicationID)

      if(!publication){
        return res.status(401).json({err : "Publication not found"})
      }

      const comment = new Comment({comment_description, user_comment: authHeader})
      publication.comments.push({_id: comment._id})

      await comment.save();
      await publication.save()
      
      return res.json({comment,publicationID})

    } catch {
      return res.status(500).json({err : "Error Create Comment"})
    }
  }

  async update(req, res) {
    const authHeader = req.headers.idUser;
    const {id} = req.params
    const {comment_description} = req.body

    try {

      const comment = await Comment.findById(id)
      
      if(!comment){
        return res.status(401).json({err : "Comment not found"})
      }

      if(comment.user_comment != authHeader){
        return res.status(401).json({err : "You cannot edit other user's comments"})
      }

      comment.comment_description = comment_description;

      await comment.save();

      return res.json(comment)

    } catch {
      return res.status(500).json({err : "Error Updating Comment or ID invalid"})
    }
  }

  async destroy(req, res) {
    const authHeader = req.headers.idUser;
    const {id} = req.params

    try {
      const comment = await Comment.findById(id)

      if(!comment){
        return res.status(401).json({err : "Publication not found"})
      }

      if(comment.user_comment != authHeader){
        return res.status(401).json({err : "You cannot delete other user's comment"})
      }

      await comment.remove()

      return res.status(204).send()
    } catch {
      return res.status(500).json({err : "Error Deleting Comment or ID invalid"})
    }
  }
}

module.exports = new CommentController()