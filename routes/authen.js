var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var db = mysql.createConnection({
  user: "namningx_root",
  host: "localhost",
  password: "c7Uq+y:6O9YKx7",
  database: "namningx_share"
});

/* GET home page. */
router.get('/', function(req, res, next) {
  db.query(`SELECT * FROM persons`,(err, result)=>{
    if(err) res.send(err);
    else res.send(result)
  });  
  //res.render('index', { title: 'Express Lockdoor' });
  //res.send()
});

module.exports = router;
