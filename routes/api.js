var express = require('express');
var router = express.Router();
const Person = require('../controller/Person');
const Share = require('../controller/share');
const SharesPersons = require('../controller/sharesPersons')
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
router.get('/shares', Share.findAllShare);
router.post('/find_share_by_id', Share.findShareByID);

//share person
router.post('/share_person', SharesPersons.findAllSharePerson);
router.post('/share_person_edit_person', SharesPersons.editSharePerson)
router.post('/share_person_edit_interest', SharesPersons.editInterest)
router.post('/share_person_set_locker', SharesPersons.setLocker)

module.exports =  router;
