const User = require('../models/User')

class UserController {

  async show(req, res){
    const authHeader = req.headers.idUser;
    
    try {
      const user = await User.findById(authHeader)

      if(!user){
        return res.status(401).json({error: "User not found"})
      }

      return res.json(user)

    } catch {
      return res.status(500).json({error: "Error listing user"})
    }
     
  }

  async store(req, res){
    const {name, email, password} = req.body;

    try {

    const checkEmail = await User.findOne({email})
  
    if(checkEmail){
      return res.status(401).json({error: "E-mail already used"})
    }
    
    const {createdAt, updatedAt} = await User.create({name, email, password})

    return res.json({name, email,createdAt, updatedAt })

    } catch {
      return res.status(500).json({error: "Error creating user"})
    }
  }

  async update(req, res){
    const authHeader = req.headers.idUser;
    const {email, oldPassword, password} = req.body

    try {

      const user = await User.findById(authHeader)
      
      if(!user){
        return res.status(401).json({error: "User not found"})
      }

      if(email != user.email){
        const userExists = await User.findOne({email})

        if(userExists){
            return res.status(401).json({error: "User already exists"})
        }
      }

      if(oldPassword && password){
        if (!(await user.compareHash(oldPassword))) {
          return res.status(400).json({ error: 'OldPassword incorrect' })
        }

        user.password = password;
      }

      await user.save()

      return res.json(user)

    } catch(e) {
      
      return res.status(500).json({error: "Error updating user"})
    }
  }

  async destroy(req,res){
    const authHeader = req.headers.idUser;

    try {
      const user = await User.findById(authHeader)

      await user.remove()

      return res.status(204).send()
    } catch{
      return res.status(500).json({error: "Error deleting user"})
    }

  }

}

module.exports = new UserController()