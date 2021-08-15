var express = require('express');
var router = express.Router();
const Person = require('../controller/person');
const Share = require('../controller/share');
const SharesPersons = require('../controller/sharesPersons')
const Transactions = require('../controller/transactions')
//const SharesModel = require('../models/share');



//person
router.get('/', function(req, res, next){  res.send('wellcome to web api')});
router.get('/persons' , Person.findAllPersons);
router.post('/person_create', Person.createPerson);
router.get('/bank_name', Person.findAllbankName);
//router.get('/get_admin', Person.findAdmin)
router.post('/set_admin', Person.setAdmin);

//share
router.post('/share_create', Share.createShare);
router.post('/share_update', Share.updateShare);
router.get('/shares', Share.findAllShare);
router.get('/shares_no_open', Share.findAllShareNoOpen);
router.post('/find_share_by_id', Share.findShareByID);
router.get('/get_share_by_week', Share.getShareByWeek);
router.post('/share_on_off', Share.onOffShare);


//share person
router.post('/share_person', SharesPersons.findAllSharePerson);
router.post('/share_person_edit_person', SharesPersons.editSharePerson)
router.post('/share_person_edit_interest', SharesPersons.editInterest)
router.post('/share_person_set_locker', SharesPersons.setLocker)
router.post('/share_person_update_comment', SharesPersons.updateComment)
router.post('/share_person_with_not_paid', SharesPersons.getSharePersonByDateWithNotPaid)
router.post('/share_person_with_person', SharesPersons.getShareOpenByCustomer)

//transactions
router.post('/get_transctions_by_date',Transactions.getTransactionByShareDate)
router.post('/set_paid_date',Transactions.setPaidDate)

module.exports =  router;
