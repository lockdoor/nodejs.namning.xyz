const bcrypt = require('bcrypt')
const AuthenModel = require('../models/authen')
exports.registerController = (req, res, next)=>{
  const { email, password} = req.body;
  bcrypt.hash(password, 10)
    .then((hash)=>{
      const user = new AuthenModel({email:email, password:hash});
      user.registerUser()
        .then(()=>{
          res.status(201).json({message: 'Register Success'})
        })
        .catch((error)=>{
          res.status(500).json({message: 'Error can not register'})
        })
    })
    .catch((error)=>{
      res.status(500).json({message: 'Error can not password hash'})
    })
}