const jwt = require('jsonwebtoken')
 const fs = require('fs')
 const privateKey = fs.readFileSync(__dirname+'/private.key')

const authorization = ((req, res, next)=>{
  const authorization = req.headers['authorization']
  if(authorization === undefined) {
    return res.status(401).json({status:401, message: 'Unauthorization', error: 'headers undefined'})
  }

  const token = req.headers['authorization'].split(' ')[1]
  if(token === undefined){
    return res.status(401).json({status:401, message: 'Unauthorization', error: 'token undefined'})
  }
  
  //const privateKey = fs.readFileSync(__dirname+'/private.key')
  jwt.verify(token, privateKey, function(error, decoded){
    if(error){
      return res.status(401).json({status:401, message: 'Unauthorization', error: 'token don,t match'})
    }
    if(decoded.role === undefined || decoded.role !== 'admin'){
      return res.status(403).json({status:401, message: 'Forbidden'})
    }
    next()
  })
})

module.exports = authorization

// const privateKey = fs.readFileSync(__dirname+'/private.key')
// console.log(privateKey.toString())
