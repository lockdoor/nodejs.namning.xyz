const db = require("../database/database");
module.exports.ifNotLoggedIn = (req, res, next) =>{
  if(!req.session.isLoggedIn){
    return res.redirect('/authen/register');
  }
  next();
}
module.exports.ifLoggedIn = (req, res, next) =>{
  if(req.session.isLoggedIn){
    return res.send('you are logined');
  }
  next();
}

module.exports.isEmailInUse = (email)=>{
  return new Promise((resolve, reject) => {
      db.query('SELECT COUNT(*) AS total FROM authen WHERE email = ?', [email], 
        function (error, results, fields) {
          if(!error){
              //console.log("EMAIL COUNT : "+results[0].total);
              return resolve(results[0].total > 0);
          } else {
              return reject(new Error('Database error!!'));
          }
        }
      );
  });
}
