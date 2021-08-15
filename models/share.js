const db = require('../database/database');
class SharesModel{
  share_type; name; fee; date_run; principle; interest_fix
   amount; pay; days; first_bid; 
   bid; no_bid; first_receive; last_receive;
  share_id;
  
  static addShare(share){
    //console.log(share)
    return db.execute(`INSERT INTO shares(
      share_type, name, fee, date_run, principle, interest_fix,
      amount, pay, days, first_bid, bid, 
      no_bid, first_receive, last_receive
    ) VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,[
      share.share_type, share.name, share.fee, share.date_run, share.principle, share.interest_fix,
      share.amount, share.pay, share.days, share.first_bid , share.bid, 
      share.no_bid, share.first_receive, share.last_receive]
    )
  }

  static findShareByID(shareID){
    return db.execute('SELECT * FROM shares WHERE share_id = ?',[shareID])
  }
  static onOffShare(shareModel){
    return db.query(`UPDATE shares SET is_open=!is_open WHERE share_id=?`,[shareModel.share_id])
  }
  static findAllShare(){
    return db.execute('SELECT * FROM shares WHERE is_open=1')
  }
  static findAllShareNoOpen(){
    return db.execute('SELECT * FROM shares WHERE is_open=0')
  }

  static updateShare(shareModel){
    return db.query(`UPDATE shares SET 
      name=?, fee=?, amount=?, date_run=?, principle=?,
      interest_fix=?, days=?, first_receive=?, last_receive=?,
      pay=?, first_bid=?, bid=?, no_bid=?
      WHERE share_id=?`,[
        shareModel.name, shareModel.fee, shareModel.amount, shareModel.date_run, shareModel.principle,
        shareModel.interest_fix, shareModel.days, shareModel.first_receive, shareModel.last_receive,
        shareModel.pay, shareModel.first_bid, shareModel.bid, shareModel.no_bid,
        shareModel.share_id
      ])
  }

  static getSharebyWeek(){
    return db.query(`SELECT sp.*,s.name AS share_name
    FROM shares_persons AS sp 
    LEFT JOIN shares AS s ON sp.share_id=s.share_id 
    WHERE share_date BETWEEN NOW()- INTERVAL 1 DAY AND NOW() + INTERVAL 7 DAY AND s.is_open=1
    ORDER BY share_date;`)
  }

  
}
module.exports = SharesModel;


// async function get(){
//   let share = {
//     "share_id": null,
//     "name": "ข้าวหอม",
//     "amount": 11,
//     "date_run": "2021-07-15T00:00:00.000Z",
//     "principle": 10000,
//     "interest_fix": null,
//     "days": 10,
//     "first_receive": 1,
//     "last_receive": 1,
//     "pay": 1000,
//     "share_type": "บิด",
//     "first_bid": 10,
//     "bid": 1,
//     "no_bid": 1
//   }
//   let response =  await SharesModel.addShare(share)
//   .then(([row])=>{
//     console.log('In then', row)    
//     return row[0]})
//   .catch((error)=>console.log(error))
//   console.log(response)
// }

// get()

