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
        tb1.interest, tb1.locker, tb1.comment
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

  static removeByShareModelUpdate(shareModel){
    return db.query("DELETE FROM shares_persons WHERE share_id=?",[shareModel.share_id])
  }

  static updateDateByShareIdAndSequence(date_run, shares_id, sequence){
    return db.query("UPDATE shares_persons SET share_date = ? WHERE share_id = ? AND sequence = ?",[date_run, shares_id, sequence])
  }

  static updateCommentBySharesPersonsId(shares_persons){
    return db.query("UPDATE shares_persons SET comment=? WHERE shares_persons_id=?",
      [shares_persons.comment, shares_persons.shares_persons_id])
  }

  static getSharePersonByDateWithNotPaid(shareModel){
    return db.query(`SELECT s.*,(SELECT COUNT(paid) FROM transactions AS t WHERE t.date=s.shares_persons_id AND t.paid=0) AS not_paid
    FROM shares_persons AS s WHERE s.share_id = ?;`,[shareModel.share_id])
  }

  static getShareOpenByCustomer(person){
    return db.query(
      `SELECT sp.*, p.nickname, s.name AS share_name, s.share_type, 
      (SELECT COUNT(t1.paid) 
       FROM transactions AS t1
        LEFT JOIN shares_persons AS sp1 ON t1.share_person_id=sp1.shares_persons_id
       WHERE t1.paid=1 AND sp1.shares_persons_id=sp.shares_persons_id) AS total_paid
    FROM shares_persons AS sp 
    LEFT JOIN persons AS p ON sp.person_id=p.person_id 
    LEFT JOIN shares AS s ON sp.share_id=s.share_id      
    WHERE sp.person_id=? AND s.is_open=1 `,[person.person_id])
  }

  

  
  
}

module.exports = SharesPersonsModel;

//SharesPersonsModel.updatePerson(201,2).then((row)=>console.log(row)).catch((error)=>console.log(error))