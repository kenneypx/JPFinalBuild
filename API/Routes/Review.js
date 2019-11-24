const express = require('express');
const router = express.Router();
const {ConnectionPool} = require('mssql')
const dbconfig = require('../SQLFunctions/config')
const jsFunction = require('../../Functions/BaseFunctions')


let config = dbconfig.config

router.get('/', (req, res, next) => {
    
  let SalesRep = req.query.SalesRep
  let Month = req.query.Month
  let Year = req.query.Year
    //console.log(req)
    const sql = new ConnectionPool(config)
    sql.connect().then(pool => {
    // sql.connect(config).then(pool => {
     // console.log('in call')
         return pool.request()
        .input('SalesRep',  SalesRep)
        .input('Month', Month)
        .input('Year',Year)
  
       // .output('Return',sql.Int)
        .execute('sp_DT_DailyReview')
     }).then(result => {  
       // console.dir(result)
       const strHeader = jsFunction.HeaderFormat(Month,Year)
        res.status(200).json
        ({dates: strHeader.dates,
         days: strHeader.days,
         colour:strHeader.colours,
         calldate:strHeader.calldate,
         startdate: strHeader.startdate,
         enddate:strHeader.enddate,
            data: result.recordset})
        sql.close()
        
     }).catch(err => {
        console.log(err)
        res.status(400).json
        ({ message: 'Error Returned' })
        sql.close()
     })
   

    
})


router.post('/', (req, res, next) => {
    
    let SalesRep = req.query.SalesRep
    let Month = req.query.Month
    let Year = req.query.Year
    let body = req.body
      console.log(req)
      sql.connect(config).then(pool => {
          return pool.request()
          .input('SalesRep', SalesRep)
          .input('Month', Month)
          .input('Year', Year)
          .input('JOURNEYPLAN',sql.NVarChar('max'),body)
  
         // .output('Return',sql.Int)
          .execute('sp_DT_Insert_HoldingTable_JSON')
       }).then(result => {  
         // console.dir(result)
         
          res.status(200).json
          ({message: result.recordset})
          sql.close()
          
       }).catch(err => {
          console.log(err)
          res.status(400).json
          ({ message: 'Error Returned' })
          sql.close()
       })
     
  
      
  })
  





module.exports = router;
