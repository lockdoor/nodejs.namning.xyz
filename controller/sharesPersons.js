const { json } = require('express')
const SharesPersonsModel = require('../models/sharesPersons')
const ShaersPersonsModel = require('../models/sharesPersons')

exports.findAllSharePerson = async (req, res, next) => {
  console.log(req.body.share_id)
  await ShaersPersonsModel.findAllSharePerson(req.body.share_id)
    .then(([row]) => res.json(row))
    .catch((error) => { console.log(error) })
}

exports.editSharePerson = async (req, res, next) => {
  console.log(req.body.person_id, req.body.shares_persons_id)

  await ShaersPersonsModel.updatePerson(req.body.person_id, req.body.shares_persons_id)
    .then((row) => {
      //console.log(row)      
      res.status(201).json(row)
    })
    .catch((error) => {
      //console.log(error)
      res.status(500).json(error)
    })
}

exports.editInterest = async (req, res, next) => {
  //สลับชื่อกัน
  shareCustomer1 = req.body.shareCustomerOld
  shareCustomer2 = req.body.shareCustomerNew
  interest = req.body.interest
  await SharesPersonsModel.updatePersonBySequence(
    shareCustomer2.person_id, null, shareCustomer1.sequence, shareCustomer1.share_id)
    .then(async () => await SharesPersonsModel.updatePersonBySequence(
      shareCustomer1.person_id, interest, shareCustomer2.sequence, shareCustomer1.share_id)
      .then(() => res.status(201).json({ "message": "success" }))
      .catch((error) => console.log(error)))
    .catch((error) => console.log(error))    
}

exports.setLocker = async(req, res, next)=>{
  await ShaersPersonsModel.setLocker(req.body.shares_persons_id)
    .then(()=>res.status(201).json({"message":"record complete"}))
    .catch((error)=>console.log(error))
}

// {
//   interest: 5,
//   shareCustomerOld: {
//     shares_persons_id: 975,
//     share_id: 10,
//     person_id: 202,
//     share_date: '2021-08-01T00:00:00.000Z',
//     sequence: 2,
//     interest: null
//   },
//   shareCustomerNew: {
//     shares_persons_id: 975,
//     share_id: 10,
//     person_id: 202,
//     share_date: '2021-08-01T00:00:00.000Z',
//     sequence: 2,
//     interest: null
//   }
// }