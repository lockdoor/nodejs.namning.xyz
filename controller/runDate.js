exports.runDate = (amount, days, dateRunString)=>{
  dateRun = new Date(dateRunString);
  list = []
  dateBegin = new Date(dateRun)
  //ทำการใส่วันเริ่มเข้าไปใน array ก่อน loop  
  list.push({ 'date': dateBegin, 'comment': 'init' })
  console.log('date run', dateBegin.toDateString())

  //ถ้าระยะส่ง 10 วัน ต้องทำวันที่เลขข้างหลังให้ตรง เช่น (1,11,21,) , (10,20,30)
  if (days == 10) {
    let lastNum = dateRun.getDate().toString().slice(-1)
    for (let i = 0; i < amount - 1; i++) {
      date = new Date(dateRun.setDate(dateRun.getDate() + days))
      if (date.getDate() == 31 && lastNum == 1) {
        list.push({ 'date': new Date(dateRun.setDate(dateRun.getDate() + 1)), 'comment': 'ระยะส่ง 10 วัน ผลบวกวัน เท่ากับ 31 ให้ทำการตั้งค่าวันเป็น 1' })
        continue
      }
      if (date.getDate().toString().slice(-1) != lastNum) {
        if ((date.getFullYear() % 4 == 0) && date.getMonth() == 2 && date.getDate() < 9 && lastNum == 0) {
          dateRun.setMonth(1)
          dateRun.setDate(29)
          list.push({ 'date': new Date(dateRun), 'comment': 'ระยะส่ง 10 วัน เลขท้ายไม่ตรงกัน เป็นปีอธิกสุรทิน เดือนกุมภาพันธ์ ผลบวกวันเกิน 29 ให้ตั้งค่าวันเป็น 29' })
          continue
        } else if (date.getMonth() == 2 && date.getDate() < 8 && (lastNum == 0 || lastNum == 9)) {
          dateRun.setMonth(1)
          dateRun.setDate(28)
          list.push({ 'date': new Date(dateRun), 'comment': 'ระยะส่ง 10 วัน เลขท้ายไม่ตรงกัน เดือนกุมภาพันธ์ ผลบวกวันเกิน 28 ให้ตั้งค่าวันเป็น 28' })
          continue
        } else if (lastNum == 0) {
          list.push({ 'date': new Date(dateRun.setDate(10)), 'comment': 'ระยะส่ง 10 วัน เลขท้ายไม่ตรงกัน ถ้าวันที่ลงท้ายด้วยเลข 0 ให้ตั้งค่าวันเป็น 10' })
          continue
        } else {
          list.push({ 'date': new Date(dateRun.setDate(lastNum)), 'comment': 'ระยะส่ง 10 วัน เลขท้ายไม่ตรงกัน ตั้งวันที่ตรงกับเลขท้าย' })
          continue
        }
      } else {
        list.push({ 'date': date, 'comment': 'day 10 normal case' })
      }
    }
    //ถ้าระยะส่ง 15 วัน ต้องทำให้เลขหลังตรงกันทุกเดือน เช่น (1,16) , (5,20)
  }
  else if (days == 15) {
    let dateNum = dateRun.getDate()
    let firstHalf = (dateNum > 15) ? dateNum - 15 : dateNum;
    let secondHalf = (dateNum < 15) ? dateNum + 15 : dateNum;
    //console.log('ก่อนเข้าลูป ',dateRun.getMonth())
    for (let i = 0; i < amount - 1; i++) {
      if (dateRun.getDate() == 15) {
        //console.log('ก่อนบวก ' , dateRun.getMonth())
        //ต้องบวกเดือนก่อน ถึงจะหาวันสุดท้ายของเดือนก่อนได้
        dateRun.setMonth(dateRun.getMonth() + 1)
        //console.log('หลังบวก ', dateRun.getMonth())
        dateRun.setDate(0)
        //console.log('หลังตั้งค่า 0 ', dateRun.getMonth())
        list.push({ 'date': new Date(dateRun), 'comment': 'day 15 last day in month' })
        //console.log('set 0')
        continue
      } else if (dateRun.getDate() == 31 || dateRun.getDate() == 30 ||
        (dateRun.getFullYear() % 4 == 0 && dateRun.getMonth() == 1 && dateRun.getDate() == 29) ||
        (dateRun.getFullYear() % 4 != 0 && dateRun.getMonth() == 1 && dateRun.getDate() == 28)) {
        //console.log('ก่อนบวก ' , dateRun.getMonth())
        //เมื่อเป็นวันที่ 29,30,31 เดือนมกราคม ทำการบวกเดือนเข้าไปพบว่าเดือนกุมภาไม่มีวันที่ ดังกล่าว จึงข้ามเดือน
        //ควรแก้โดยการตั้งค่าวันก่อน แล้วจึงบวกเดือน
        dateRun.setDate(15)
        dateRun.setMonth(dateRun.getMonth() + 1)
        //console.log('หลังบวก ', dateRun.getMonth())

        list.push({ 'date': new Date(dateRun), 'comment': 'day 15 set date = 15' })
        //console.log('set 15')
        continue
      } else if (dateRun.getDate() < 15) {
        dateRun.setDate(secondHalf)
        //dateRun.setMonth(dateRun.getMonth() + 1)
        list.push({ 'date': new Date(dateRun), 'comment': 'day 15 second half month' })
        //console.log(' < 15')
        continue
      } else if (dateRun.getDate() > 15) {
        dateRun.setDate(firstHalf)
        dateRun.setMonth(dateRun.getMonth() + 1)
        list.push({ 'date': new Date(dateRun), 'comment': 'day 15 first half month' })
        //console.log(' > 15')
        continue
      } else {
        continue
      }

    }

  }
  else if (days == 30) {
    let dateNum = dateRun.getDate();
    let endOfMonth = new Date(dateRun)
    endOfMonth.setMonth(endOfMonth.getMonth() + 1)
    endOfMonth.setDate(0)
    //ถ้าเป็นวันสิ้นเดือน
    if (dateNum == endOfMonth.getDate()) {
      for (let i = 0; i < amount - 1; i++) {
        dateRun.setDate(28)
        dateRun.setMonth(dateRun.getMonth() + 2)
        dateRun.setDate(0)
        list.push({ 'date': new Date(dateRun), 'comment': 'day 30 end of month' })
        continue
      }
    } else {
      for (let i = 0; i < amount - 1; i++) {
        if ((dateRun.getDate() == 30 || dateRun.getDate() == 29) && dateRun.getMonth() == 0) {
          //let date = dateRun.getDate();
          if (dateRun.getFullYear() % 4 == 0) {
            dateRun.setDate(29)
            dateRun.setMonth(dateRun.getMonth() + 1)
            list.push({ 'date': new Date(dateRun), 'comment': 'day 30 กุมภา 29' })
            dateRun.setMonth(dateRun.getMonth() + 1)
            continue
          } else {
            dateRun.setDate(28)
            dateRun.setMonth(dateRun.getMonth() + 1)
            list.push({ 'date': new Date(dateRun), 'comment': 'day 30 กุมภา 28' })
            dateRun.setMonth(dateRun.getMonth() + 1)
            continue
          }
        } else {
          dateRun.setDate(dateNum)
          dateRun.setMonth(dateRun.getMonth() + 1)
          list.push({ 'date': new Date(dateRun), 'comment': 'day 30 normal' })
          continue
        }
      }
    }
  }
  else {
    for (let i = 0; i < amount - 1; i++) {
      list.push({ 'date': new Date(dateRun.setDate(dateRun.getDate() + days)), 'comment': 'normal case' })
    }
  }
  return list
}
// const dateRun = new Date(2020, 0, 29);
// const amount = 20
// const days = 30
// list = runDate(amount, days, dateRun)
// for (let i in list) {
//   console.log(`${parseInt(i) + 1}`, list[i].date.toDateString(), list[i].comment)
// }