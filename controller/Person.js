const PersonsModel = require('../models/persons');
const SharesModel = require('../models/share');
const SharesPersonsModel = require('../models/sharesPersons')

exports.createPerson = async (req, res, next) => {
  const person = req.body
  let allowRecordFromPhone = false
  let allowRecordFromCitizenId = false  
  let hasPhone = false
  let hasCitizenID = false

  let responsJson
  let personID
  console.log(req.body)
  //เช็คเลขบัตรประชาชน
  if (person.citizenID !== '') {
    console.log('มีข้อมูลบัตรประชาชน ทำการค้นหาว่าซ้ำหรือไม่')
    await PersonsModel.findByCitizenID(person.citizenID)
      .then(([row]) => {
        if (row.length === 0) {
          console.log('เลขบัตรประชาชน ไม่ซ้ำ ตั้งค่าเตรียมบันทึก')
          hasCitizenID = true
          allowRecordFromCitizenId = true
        } else {
          console.log('เลขบัตรประชาชน ซ้ำ ตั้งค่าไม่บันทึก')
          allowRecordFromCitizenId = false
          responsJson = { 'message': 'หมายเลขบัตรประชาชนซ้ำ' }
        }
      })
  } else {
    console.log('ไม่มีข้อมูลบัตรประชาชน ตั้งค่าบันทึก')
    hasCitizenID = false
    allowRecordFromCitizenId = true
  }

  //เช็คหมายเลขโทรศัพท์
  if (person.phoneNumber[0].number !== '') {
    console.log('มีข้อมูลหมายเลขโทรศัพท์ ทำการค้นหาว่าซ้ำหรือไม่')
    let phoneNumber = []
    for (let i in person.phoneNumber) {
      phoneNumber.push(person.phoneNumber[i].number)
    }
    await PersonsModel.findByPhoneNumber(phoneNumber)
      .then(([row]) => {
        if (row.length === 0) {
          //console.log(row)
          console.log('หมายเลขโทรศัพท์ไม่ซ้ำ ตั้งค่าบันทึก')
          allowRecordFromPhone = true
          hasPhone = true
        } else {
          console.log('หมายเลขโทรศัพท์ซ้ำ ตั้งค่าไม่บันทึก')
          allowRecordFromPhone = false
          hasPhone = false
          responsJson = { 'message': 'หมายเลขโทรศัพท์ซ้ำ ' + row[0].phone_number}
        }
      })
  } else {
    console.log('ไม่มีข้อมูลหมายเลยโทรศัพท์ ตั้งค่าบันทึก')
    allowRecordFromPhone = true
    hasPhone = false
  }

  //เมื่อเช็คหมายเลขบัตรประชาชนและหมายเลขโทรศัพท์แล้ว ให้มีการบันทึกได้
  if (allowRecordFromCitizenId && allowRecordFromPhone) {    
    if (hasCitizenID) {
      console.log('ทำการบันทึกโดยใส่หมายเลขบัตรประชาชน')
      await PersonsModel.addPersonWithCitizenID(person)
        .then(([row]) => {
          personID = row.insertId
          responsJson = { 'message': 'ทำการบันทึกโดยใส่หมายเลขบัตรประชาชน id = ' + personID }
        })
    } else {
      console.log('ทำการบันทึกโดยไม่ใส่หมายเลยบัตรประชาชน')
      await PersonsModel.addPersonWithOutCitizenID(person)
        .then(([row]) => {
          personID = row.insertId
          responsJson = { 'message': 'ทำการบันทึกโดยไม่ใส่หมายเลยบัตรประชาชนid = ' + personID + '\n' }
        })
    }
  
    //ทำการบันทึกหมายเลขโทรศัพท์
    if(hasPhone){
      console.log('ทำการบันทึกหมายเลขโทรศัพท์')
      let phoneNumber = []
      for (let i in person.phoneNumber) {
        phoneNumber.push([person.phoneNumber[i].number, personID])
      }
      //console.log(phoneNumber);
      await PersonsModel.addPhoneNumber(phoneNumber)
        .then((result)=>{
          //console.log (result)
          //console.log(result[0].affectedRows)
          console.log('เพิ่มหมายเลขโทรศัพท์แล้วจำนวน', result[0].affectedRows )          
          responsJson.message += ' เพิ่มหมายเลขโทรศัพท์แล้วจำนวน ' + result[0].affectedRows + '\n'
        })
        .catch((error)=>{
          responsJson = { 'message': error.sqlMessage }
        })
    }

    //ทำการบันทึกบันชีธนาคาร
    if(person.bankAccount[0].account !== 0){
      let bankAccout = []
      for (let i in person.bankAccount) {
        bankAccout.push([person.bankAccount[i].bank, person.bankAccount[i].account, personID])
      }
      await PersonsModel.addBankAccount(bankAccout)
        .then((result)=> {
          console.log('เพิ่มบัญชีธนาคารแล้วจำนวน ' + result[0].affectedRows)
          responsJson.message += ' เพิ่มบัญชีธนาคารแล้วจำนวน ' + result[0].affectedRows
        })
    }
  }


  let alreadyRecord = (allowRecordFromCitizenId && allowRecordFromPhone)

  console.log('alreadyRecord is ',alreadyRecord)
  if(alreadyRecord){
    
    res.status(201).json(responsJson)
  }else{
    res.json(responsJson)
  }
  //res.json(responsJson)
}

exports.findAllbankName = async(req, res, next)=>{
  await PersonsModel.findAllBankName()
  .then(([row])=>{
    let str = row[0].enum;
    str = str.slice(5 , -1);
    str = str.split("'").join("");
    const strList = str.split(",");
    const json = strList.map(str => {
        return {'bankName': str};
    });
    res.json(json);   
  })
  .catch((error)=>console.log(error));
}

exports.findAllPersons = async(req, res, next)=>{
  await PersonsModel.findAllPersons()
    .then(([row])=>{res.status(200).json(row)})
    .catch((error)=>console.log(error));
}

exports.findAdmin = async(req, res, next)=>{
  await PersonsModel.findAdmin()
  .then(([row])=>{
    console.log('find admin work')
    if(row.length == 0){
      console.log("Admin not found")
      return res.status(204).json({"message": "Admin not found"})
    }else{
      console.log("admin is", row[0].nickname)
      return res.status(200).json(row[0])}})
  .catch((error)=>console.log(error));
}

exports.setAdmin = async(req, res, next)=>{
  let adminNew = req.body
  console.log(adminNew)
  await PersonsModel.adminUnset()
  .then(([row])=>{
    console.log('ยกเลิก admin เก่า เรียบร้อยแล้ว')
    console.log('admin old is', row)
    //รับค่า admin เก่ามาด้วย
  })
  .catch((error)=>{console.log(error)})
  await PersonsModel.adminSet(adminNew.person_id)
    .then(async([row])=>{
      console.log('เพิ่ม admin ใหม่ เรียบร้อยแล้ว')
      res.status(201).json({"message": "เพิ่ม admin ชื่อ " + adminNew.nickname + " เรียบร้อยแล้ว"})
      //ทำการเปลี่ยน admin ใน sharesPersons ทุกวงแชร์
      await SharesModel.findAllShare().then(async([row])=>{
        for(let index in row){
          console.log(row[index].name)
          let share = row[index]
          if(share.first_receive == true){
            console.log('ทำการเพิ่ม admin เข้าไปที่มือแรก')
            SharesPersonsModel.updatePerson(adminNew.person_id, 1, share.share_id)
          }
          if(share.last_receive == true){
            SharesPersonsModel.updatePerson(adminNew.person_id, share.amount , share.share_id)
            console.log('ทำการเพิ่ม admin เข้าไปที่มือสุดท้าย ที่มือ  =',share.amount )
          }
        }
      })
    })   
    .catch((error)=>{console.log(error)}) 
}