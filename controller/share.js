//const { Result } = require('express-validator');
const { json } = require('express');
const { Result } = require('express-validator');
const PersonsModel = require('../models/persons');
const SharesModel = require('../models/share');
const SharesPersonsModel = require('../models/sharesPersons');
const RunDate = require('./runDate');
const TransactionModel = require('../models/transactions')
//SharesModel = require('../models/share');

exports.createShare = async (req, res, next) => {
  //console.log(req.body)
  share = req.body
  //console.log(share)
  await SharesModel.addShare(share)
    .then(async([row]) => {
      res.status(201).json(row)
      console.log(row)
      //สร้างวันที่ให้แชร      
      let date = RunDate.runDate(share.amount, share.days, share.date_run)
      let shareID = row.insertId
      let shareIDdate = []
      for (let i in date) {
        shareIDdate.push([shareID, date[i].date, parseInt(i) + 1])
      }
      //สร้างแชร์ใน sharesPersons
      await SharesPersonsModel.addDateShare(shareIDdate)
        .then(async ([row]) => {
          //นำชื่อท้าวแชร์ไปใส่ในมือต้นและท้าย
          let admin = await PersonsModel.findAdmin().then(([row])=>row[0]);
          //console.log(responseJson.person_id)
          if(share.first_receive == true){
            console.log('ทำการเพิ่ม admin เข้าไปที่มือแรก')
            SharesPersonsModel.updatePersonAdmin(admin.person_id, 1, shareID)
          }
          if(share.last_receive == true){
            SharesPersonsModel.updatePersonAdmin(admin.person_id, shareIDdate.length , shareID)
            console.log('ทำการเพิ่ม admin เข้าไปที่มือสุดท้าย ที่มือ  =',shareIDdate.length.toString() )
          }
          //สร้างวันที่ส่งแชร์ใน transection
          //หา id ได้จาก row.insertId เป็น id แรกที่ทำการ insert ถึงจำนวนสุดท้ายคือบวกกับ row.affectdRows
          console.log(row)
          let firstInsertId = row.insertId
          let count = row.affectedRows          
          //let lastInsertId = firstInsertId + count
          for(let i = 0; i < count; i++){
            console.log(firstInsertId)
            let transactions = []
            for(let n in date){
              transactions.push([firstInsertId, date[n].date , 0])
            }
            await TransactionModel.addTransactionBySharesPersonsId(transactions)
             .then((row)=>console.log(row))
             .catch((error)=>console.log(error))
            firstInsertId++
          }

        }).catch((error) => {
          console.log('error when add date')
          console.log(error)});      
    })
    .catch((error) => {
      console.log('error when add share')
      console.log(error)
      res.send(error)
    });
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
    .then(([row]) => { res.json(row) })
    .catch((error) => {
      //console.log(error)
      res.send(error)
    });
}

