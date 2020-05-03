const Comment = require('../models/Comment')
const Publication = require('../models/Publication')
const ErrorApi = require('../errors')

class CommentController {

  async index(req, res) {
    const authHeader = req.headers.idUser

    const comments = await Publication.find({ owner_user: {"$nin": authHeader}}, "description")
      .populate({
        path: "comments",
        match: {user_comment: authHeader}
      }) 
        
      const commentsFilter = comments.filter(({comments}) => comments.length > 0)

      return res.json(commentsFilter)
  }

  async show(req, res) {
    const authHeader = req.headers.idUser

    const comments = await Publication.find({owner_user: authHeader}, "description")
      .populate({
        path: 'comments'
      })

    return res.json(comments)

  }

  async store(req, res) {
    const authHeader = req.headers.idUser
    const {publicationID} = req.query
    const { comment_description } = req.body

    const publication = await Publication.findById(publicationID)

    if(!publication){
      throw new ErrorApi("Comment not found", 404)
    }

    const comment = new Comment({comment_description, user_comment: authHeader})
    publication.comments.push({_id: comment._id})

    await comment.save();
    await publication.save()
    
    return res.json({comment,publicationID})
  }

  async update(req, res) {
    const authHeader = req.headers.idUser;
    const {id} = req.params
    const {comment_description} = req.body

    const comment = await Comment.findById(id)
    
    if(!comment){
      throw new ErrorApi("Comment not found",404)
    }

    if(comment.user_comment != authHeader){
      throw new ErrorApi("You cannot edit other user's comments")
    }

    comment.comment_description = comment_description;

    await comment.save();

    return res.json(comment)
  }

  async destroy(req, res) {
    const authHeader = req.headers.idUser;
    const {id} = req.params
    
      const comment = await Comment.findById(id)
      
      if(!comment){
        throw new ErrorApi("Comment not found",404)
      }

      if(comment.user_comment != authHeader){
        throw new ErrorApi("You cannot delete other user's comment")
      }

      await comment.remove()
      await Publication.updateOne({}, {$pull: {comments: id}})

      return res.status(204).send()
  }
}

module.exports = new CommentController()