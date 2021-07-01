var express = require('express');
const authorization = require('../controller/authorize');
var router = express.Router();
const login = require('../controller/login')
const AuthenModel = require('../models/authen')
//var register = require('../controller/register')

router.get('/', authorization, function(req, res, next){
  res.send('wellcome to web api')
})

router.post('/login', login.loginController)

router.get('/users', authorization, function(req, res, next){
  AuthenModel.findAllUsers()
    .then(([row])=>{
      res.json(row)
    })
})

module.exports =  router;
