const db = require('../database/database');

class PersonsModel{
  personID; nickname; citizenID; phoneNumber; share; bankAccout; fname; lname;

  static findAllPersons(){
    return db.execute('SELECT * FROM Persons')
  }

  static findByCitizenID(citizenID){
    return db.execute('SELECT citizen_id FROM persons WHERE citizen_id = ?',[citizenID])
  }

  static addPersonWithCitizenID(person){
    return db.execute(`INSERT INTO persons(nickname, citizen_id, fname, lname)VALUE(?,?,?,?)`,
    [person.nickname, person.citizenID, person.fname, person.lname])
  }

  static addPersonWithOutCitizenID(person){
    return db.execute(`INSERT INTO persons(nickname, fname, lname) VALUE(?,?,?)`,    
    [person.nickname, person.fname, person.lname])
  }

  static findByPhoneNumber(phoneNumber){
    return db.query('SELECT phone_number FROM phones WHERE phone_number IN(?)',[phoneNumber])
  }

  static addPhoneNumber(phoneNumber){
    return db.query('INSERT INTO phones(phone_number, person_id) VALUES ?',[phoneNumber])
  }

  static addBankAccount(bankAccount){
    return db.query('INSERT INTO bank(bank, account, person_id) VALUES ?',[bankAccount])
  }

  static findAllBankName(){
    return db.query("SELECT COLUMN_TYPE as 'enum' FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'namningx_share' AND TABLE_NAME = 'bank' AND COLUMN_NAME = 'bank';");
  }

  static findAdmin(){
    return db.query("SELECT * FROM persons WHERE admin = ?",[1]);
  }

  static adminUnset(){
    return db.query('UPDATE persons SET admin = 0  WHERE admin = 1')
  }

  static adminSet(person_id){
    return db.query('UPDATE persons SET admin = 1 WHERE person_id = ?',[person_id])
  }

}
module.exports =  PersonsModel;

// PersonsModel.findAdmin()
//   .then(([row])=>{
//     console.log('find admin work')
//     if(row.length == 0){
//       console.log("Admin not found")
//       //return res.status(204).json({"message": "Admin not found"})
//     }else{
//       console.log("admin is", row[0].nickname)
//       //return res.json(row)
//     }})
//   .catch((error)=>console.log(error));