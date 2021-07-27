const db = require('../database/database');

class TransactionModel{

  static addTransactionBySharesPersonsId(transactions){
    return db.query(`INSERT INTO transactions(
      share_person_id, date, paid) VALUE ?`,
      [transactions])
  }
}

module.exports = TransactionModel