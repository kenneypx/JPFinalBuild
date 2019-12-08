const express = require('express');
const router = express.Router();
const {ConnectionPool} = require('mssql')
const dbconfig = require('../SQLFunctions/config')


let config = dbconfig.config

router.get('/', (req, res, next) => {
    
  let UserID = req.query.UserID
  let OrderID = req.query.OrderID
  let FlagAll = req.query.FlagAll
  const sql = new ConnectionPool(config)
   sql.connect().then(pool => {
   // sql.connect(config).then(pool => {
         return pool.request()
         .input('UserID',UserID)
        .input('OrderID', OrderID)
        .input('FlagAll',  FlagAll)
       // .output('Return',sql.Int)
        .execute('sp_Orders')
     }).then(result => {  
        //console.dir(result)
        res.status(200).json
        ({message: result.recordset})
        sql.close()
     }).catch(err => {
        console.log(err)
        res.status(400).json
        ({ message: 'Error Returned',
        detail:err})
        sql.close()
     })
   

    
})

   

module.exports = router;
