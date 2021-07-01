const db = require('../database/database')
class AuthenModel {
  email; password; id; date_create; last_seen;

  constructor(email, password){
    this.email = email
    this.password = password
  }

  registerUser(){
    return db.execute('INSERT INTO authen (email, password) VALUE (?, ?)', 
      [this.email, this.password])
  }

  static findUserByEmail({email = ''}){
    return db.execute('SELECT * FROM `authen` WHERE `email` = ?', [email])    
  }
  
  static findAllUsers(){
    return db.execute('SELECT * FROM authen')
  }
}


// const user = new Authen('locdoor31@gmail.com', '46671111')
// user.registerUser().then(([row])=>console.log(row))

// AuthenModel.findUserByEmail('lockdoor@gmail.com')
//   .then(([row])=>{
//     console.log(row[0])
//     db.close()
//   })

// AuthenModel.findAllUsers().then(([row])=>console.log(row))

module.exports = AuthenModel;