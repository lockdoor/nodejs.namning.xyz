//const { json } = require('express');
//const { Result } = require('express-validator');
const PersonsModel = require('../models/persons');
const SharesModel = require('../models/share');
const SharesPersonsModel = require('../models/sharesPersons');
const RunDate = require('./runDate');
const TransactionModel = require('../models/transactions')
async function updatePersonAdmin(share, share_id) {
  //นำชื่อท้าวแชร์ไปใส่ในมือต้นและท้าย
  let admin = await PersonsModel.findAdmin().then(([row]) => row[0]);
  if (share.first_receive == true) {
    console.log(`admin = ${admin.person_id} , sequence = 1, share_id = ${share_id}`)    
    await SharesPersonsModel.updatePersonAdmin(admin.person_id, 1, share_id)
      .then((row)=>console.log('ทำการเพิ่ม admin ไปที่มือแรกเสร็จแล้ว'))
      .catch((error)=>console(error))
  }
  if (share.last_receive == true) {
    await SharesPersonsModel.updatePersonAdmin(admin.person_id, share.amount, share_id)
    console.log('ทำการเพิ่ม admin เข้าไปที่มือสุดท้าย ที่มือ  =', share.amount.toString())
  }
}
async function createSharesPersons(share, shareId) {
  //res.status(201).json(row)
  //console.log(row)
  //สร้างวันที่ให้แชร      
  let date = RunDate.runDate(share.amount, share.days, share.date_run)
  let shareID = shareId
  let shareIDdate = []
  for (let i in date) {
    shareIDdate.push([shareID, date[i].date, parseInt(i) + 1])
  }
  //สร้างแชร์ใน sharesPersons
  await SharesPersonsModel.addDateShare(shareIDdate)
    .then(async ([row]) => {
      await updatePersonAdmin(share ,shareID)

      //สร้างวันที่ส่งแชร์ใน transection
      //หา id ได้จาก row.insertId เป็น id แรกที่ทำการ insert ถึงจำนวนสุดท้ายคือบวกกับ row.affectdRows
      //console.log(row)
      let firstInsertId = row.insertId
      let count = row.affectedRows
      //let lastInsertId = firstInsertId + count
      for (let i = 0; i < count; i++) {
        //console.log(firstInsertId)
        let dateBySharesPersonsId = row.insertId;
        let transactions = []
        //console.log('shares_person_id', firstInsertId)
        //แบบใหม่ที่เอา shares_persons_id มาใส่ ใน transaction.date
        for (let n = 0; n < count; n++) {
          //console.log('transactioin',dateBySharesPersonsId)
          transactions.push([firstInsertId, dateBySharesPersonsId, 0])
          dateBySharesPersonsId++

        }
        //แบบเก่าที่เอาวันที่ไปใส่ใน transaction.date
        // for(let n in date){
        //   transactions.push([firstInsertId, date[n].date , 0])
        // }

        await TransactionModel.addTransactionBySharesPersonsId(transactions)
          .then((row) => { })
          .catch((error) => console.log(error))
        firstInsertId++
      }
      //return true
    }).catch((error) => {
      console.log('error when add date')
      console.log(error)
      //return false
    });
}

exports.createShare = async (req, res, next) => {
  console.log(req.body)
  share = req.body
  //console.log(share)
  await SharesModel.addShare(share)
    .then(async ([row]) => {
      await createSharesPersons(share, row.insertId)
      res.status(201).json({ "message": "create complete" })
    })
    .catch((error) => {
      console.log('error when add share')
      console.log(error)
      res.send(error)
    });
}

exports.updateShare = async (req, res, next) => {
  console.log(req.body)
  let shareModelNew = req.body.shareModelNew
  let shareModelOld = req.body.shareModelOld
  let checkChangeDate = shareModelNew.date_run == shareModelOld.date_run
  console.log("มีการเปลี่ยนแปลงวันที่หรือไม่ : ", checkChangeDate)
  await SharesModel.updateShare(shareModelNew)
    .then(async () => {
      //ถ้ามีการเปลี่ยนแปลง จำนวนมือ ให้ลบ shares_persons ออก แล้วทำการสร้างใหม่
      if (shareModelNew.amount != shareModelOld.amount) {
        //ลบ shares_persons
        SharesPersonsModel.removeByShareModelUpdate(shareModelNew)
          .then(async () => {
            //สร้างใหม่ 
            await createSharesPersons(shareModelNew, shareModelNew.share_id)
            res.status(201).json({ "message": "มีการเปลี่ยนแปลงจำนวนมือทำให้ต้องลบข้อมูลเก่าแล้วสร้างใหม่" })
          })
          .catch((error) => console.log(error))
      }
      //ถ้ามีการเปลี่ยนแปลง วันที่เริ่ม ระยะส่ง ให้ทำการจัดเรียงวันใหม่ แล้วทำการอัพเดต
      else if (
        shareModelNew.date_run != shareModelOld.date_run ||
        shareModelNew.days != shareModelOld.days) {
        //เริ่มทำการจัดเรียงวันใหม่เพื่ออัพเดตตาราง shares_persons.share_date
        console.log("เริ่มทำการจัดเรียงวันใหม่เพื่ออัพเดตตาราง shares_persons.share_date")
        let date = RunDate.runDate(shareModelNew.amount, shareModelNew.days, shareModelNew.date_run)
        let shareID = shareModelNew.share_id
        //let shareIDdate = []
        //ใช้ loop ส่งคำสั่ง sql
        for (let i in date) {
          //shareIDdate.push([shareID, date[i].date, parseInt(i) + 1])
          await SharesPersonsModel.updateDateByShareIdAndSequence(date[i].date, shareID, parseInt(i) + 1)

        }
        res.status(201).json({ "message": "มีการเปลี่ยนแปลงวันที่ทำให้ต้องกำหนดวันใหม่" })

      }


      else {
        //นำชื่อท้าวแชร์ไปใส่ในมือต้นและท้าย
        await updatePersonAdmin(shareModelNew, shareModelNew.share_id)
        res.status(201).json({ "message": "เปลี่ยนแปลงตารางนี้ไม่ส่งผลต่อตารางอื่น" })

      }
      //res.status(201).json({"message":"update complete"})
    }).catch((error) => console.log(error))


}

exports.findShareByID = async (req, res, next) => {
  //console.log('findShareByID worked')
  await SharesModel.findShareByID(req.body.share_id)
    .then(([row]) => {
      //console.log(row[0])
      res.json(row[0])
    })
    .catch((error) => {
      //console.log(error)
      res.send(error)
    });
}

exports.findAllShare = async (req, res, next) => {
  await SharesModel.findAllShare()
    .then(([row]) => {
      //console.log(row)
      res.json(row)
    })
    .catch((error) => {
      console.log(error)
      res.json(error)
    });
}

exports.findAllShareNoOpen = async (req, res, next) => {
  await SharesModel.findAllShareNoOpen()
    .then(([row]) => {
      //console.log(row)
      res.json(row)
    })
    .catch((error) => {
      console.log(error)
      res.json(error)
    });
}

exports.getShareByWeek = async(req,res,next) =>{
  await SharesModel.getSharebyWeek()
    .then(([row])=>res.json(row))
    .catch((error)=>console.log(error))
}

exports.onOffShare = async(req, res, next) =>{
  console.log(req.body)
  await SharesModel.onOffShare(req.body)
    .then(([row])=>{
      console.log([row])
      console.log(row.affectedRows)
      if(row.affectedRows==1){
        res.status(201).json({"message":"update complete"})
      }

      
    })
    .catch((error)=>console.log(error))
}



//ถ้าสั่งให้ทำงานจากตรงนีจะไม่มีตัวแปร req res เข้ามาให้ใช้งาน


//exports.findAllShare();