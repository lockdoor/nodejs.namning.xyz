const db = require('../database/database');

class TransactionModel{

  static addTransactionBySharesPersonsId(transactions){
    return db.query(`INSERT INTO transactions(
      share_person_id, date, paid) VALUE ?`,
      [transactions])
  }
  
  static getTransactionByShareDate(date_id){
    return db.query(`SELECT t.*, s.sequence, p.nickname,(SELECT share_date FROM shares_persons WHERE shares_persons_id = ?) AS share_date
    FROM transactions AS t
    LEFT JOIN shares_persons AS s ON t.share_person_id = s.shares_persons_id
    LEFT JOIN persons AS p ON s.person_id = p.person_id
    WHERE t.date = ?`,[date_id, date_id])
  }

  static setPaidDate(transactions){
    return db.query(`UPDATE transactions SET paid_date=?, paid=? WHERE transactions_id=?`,
    [transactions.paid_date, transactions.paid, transactions.transactions_id])
  }

}

module.exports = TransactionModel