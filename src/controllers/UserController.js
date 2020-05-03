const User = require('../models/User')
const ErrorApi = require('../errors')

class UserController {

  async show(req, res){
    const authHeader = req.headers.idUser;
      const user = await User.findById(authHeader)

      if(!user){
        throw new ErrorApi("User not found", 404)
      }

      return res.json(user)
  }

  async store(req, res){
    const {name, email, password} = req.body;


    const checkEmail = await User.findOne({email})
  
    if(checkEmail){
     throw new ErrorApi("E-mail already used")
    }
    
    const {createdAt, updatedAt} = await User.create({name, email, password})

    return res.json({name, email,createdAt, updatedAt })
    
  }

  async update(req, res){
    const authHeader = req.headers.idUser;
    const {name, email, oldPassword, password} = req.body
      const user = await User.findById(authHeader)
      
      if(!user){
        throw new ErrorApi("User not found", 404)
      }

      if(email && (email != user.email)){
        const userExists = await User.findOne({email})

        if(userExists){
          throw new ErrorApi("User already exists")
        }

        user.email = email
      }

      if(oldPassword){
        if (!(await user.compareHash(oldPassword))) {
          throw new ErrorApi('OldPassword incorrect')
        }

        user.password = password;
      }

      user.name = name ? name : user.name;
      await user.save()

      return res.json(user)
  }

  async destroy(req,res){
    const authHeader = req.headers.idUser;

    const user = await User.findById(authHeader)

    if(!user){
      throw new ErrorApi('User not found', 204)
    }

    await user.remove()

    return res.status(204).send()
  }
}

module.exports = new UserController()