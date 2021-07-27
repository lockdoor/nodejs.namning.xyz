const AuthenModel = require('../models/authen')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fs = require('fs')

exports.loginController = (req, res, next)=>{
  const { email= '', password} = req.body
  AuthenModel.findUserByEmail({email:email})
    .then(([row])=>{
      if(row.length !==0){
        return bcrypt.compare(password, row[0].password)
          .then((result)=>{
            if(!result){
              res.status(401).json({message: 'Authentication failed Password wrong'})
            }else{
              const privateKey = fs.readFileSync(__dirname+'/private.key')
              let jwtToken = jwt.sign({
                  email: row[0].email,
                  user_id: row[0].user_id,
                  role: 'admin'               
                },
              privateKey,
              {expiresIn: '1h'}
              );
              // res.setHeader('Access-Control-Allow-Origin', '*');
              // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
              // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
              // res.setHeader('Access-Control-Allow-Credentials', true);
              res.status(200).json({token: jwtToken, expiresIn: 3600})
            }
          })
          .catch((error)=>{
            res.status(401).json({message: 'Authenticatioin failed',error: error})
          })
      }else{
        res.status(401).json({message: 'Authentication failed Email Wrong!'})
      }
    })
    .catch((error)=>{
      res.status(500).json({
        message: error
      })
    })
}