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
   
   const sql = new ConnectionPool(config)
   // console.log('Hit Jorney Plan Get')
   sql.connect().then(pool => {
   // sql.connect(config).then(pool => {
     //  console.log('test')
        return pool.request()
        .input('SalesRep',  SalesRep)
        .input('Month',  Month)
        .input('Year', Year)
        .input('Mode','Create')
       // .output('Return',sql.Int)
        .execute('sp_DT_GetJourneyPlan')
     }).then(result => {  
      // console.dir(result)
        const strHeader = jsFunction.HeaderFormat(Month,Year)
         //console.log(strHeader)
   
        res.status(200).json
        ({ dates: strHeader.dates,
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
    let PlanID = req.query.PlanID
    let body = req.body
    // console.log(body)

     const sql = new ConnectionPool(config)
   //  console.log('Hit Jorney Plan Get')
    sql.connect().then(pool => {
          return pool.request()
          .input('SalesRep',  SalesRep)
          .input('Month',  Month)
          .input('Year', Year)
          .input('PlanID', PlanID)
          .input('JOURNEYPLAN',JSON.stringify(body))
  
         // .output('Return',sql.Int)
          .execute('sp_DT_Insert_HoldingTable_JSON')
       }).then(result => {  
         // console.dir(result)
          sql.close()
          res.status(200).json
          ({message: 'Success',
            rowsposted : result.rowsAffected})
         
          
       }).catch(err => {
          console.log(err)
          res.status(400).json
          ({ message: 'Error Returned' })
          sql.close()
       })
     
  
      
  })
  







   

module.exports = router;
