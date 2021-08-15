const { body } = require('express-validator')
const TransactionModel = require('../models/transactions')
exports.getTransactionByShareDate = async (req, res, next) => {
  let date_id = req.body.shares_persons_id
  //console.log(date_id)
  await TransactionModel.getTransactionByShareDate(date_id)

    .then(([row])=>{
      //console.log(row)
      res.status(201).json(row)
    })
    .catch((error)=>console.log(error))
}

exports.setPaidDate = async(req, res, next)=>{
  // console.log(req.body)
  await TransactionModel.setPaidDate(req.body)
    .then((row)=>{
      if(row.affectedRows == 1)res.status(201).json({"message":"update complete"})
    })
    .catch((error)=>console.log(error))
}