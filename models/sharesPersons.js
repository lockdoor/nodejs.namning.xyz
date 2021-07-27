const db = require('../database/database');
class SharesPersonsModel{
  shares_persons_id;
  share_id;
  person_id;
  share_date;
  sequence;

  static findAllSharePerson(shareID){
    return db.execute(
      `SELECT tb1.shares_persons_id, tb1.share_id, tb2.admin,
        tb1.person_id, tb1.share_date, tb1.sequence, tb2.nickname,
        tb1.interest, tb1.locker
        FROM shares_persons as tb1
        LEFT JOIN persons as tb2
        ON tb1.person_id = tb2.person_id
        WHERE tb1.share_id = ?`,
        [shareID])
  }
  
  static addDateShare(shareIDdates){
    return db.query('INSERT INTO shares_persons(share_id, share_date, sequence) VALUE ?',[shareIDdates])
  }

  static updatePersonAdmin(person_id , sequence, share_id){
    return db.query(
      'UPDATE shares_persons SET person_id = ?, locker = 1, interest = 0  WHERE sequence = ? AND share_id = ?',
      [person_id, sequence, share_id])
  }

  static updatePerson(person_id, shares_persons_id){
    return db.query( "UPDATE shares_persons SET person_id = ? WHERE shares_persons_id = ?",[person_id, shares_persons_id])
  }

  static updatePersonBySequence(person_id, interest, sequence , share_id){
    return db.query("UPDATE shares_persons SET person_id = ?, interest = ? WHERE sequence = ? AND share_id = ?",
      [person_id, interest, sequence, share_id])
  }

  static setLocker(shares_persons_id){
    return db.query("UPDATE shares_persons SET locker = !locker WHERE shares_persons_id = ?",[shares_persons_id])
  }
  
}

module.exports = SharesPersonsModel;

//SharesPersonsModel.updatePerson(201,2).then((row)=>console.log(row)).catch((error)=>console.log(error))