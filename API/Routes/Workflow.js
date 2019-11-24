const express = require('express');
const router = express.Router();
const {ConnectionPool} = require('mssql')
const dbconfig = require('../SQLFunctions/config')
const jsFunction = require('../../Functions/BaseFunctions')

let config = dbconfig.config
//const config = require('../../config');
// Change  Coonfig entries //
//var SQLconfig = config.database;

router.post('/', (req, res, next) => {
    const Status = req.query.Status
    const SalesManager = req.query.SalesManager
    const SalesRep = req.query.SalesRep
    const PlanID = req.query.PlanID

    const sql = new ConnectionPool(config)
    console.log('Hit Jorney Plan Get')
   sql.connect().then(pool => {
   // sql.connect(config).then(pool => {
      return pool.request()
      .input('SalesRep',  SalesRep)
      .input('Status',  Status)
      .input('SalesManager',SalesManager)
      .input('PlanID', PlanID)
 
     // .output('Return',sql.Int)
      .execute('sp_DT_AppRej')
   }).then(result => {  
      res.status(200).json
      ({message : 'Success'})
      sql.close()
      
   }).catch(err => {
      console.log(err)
      res.status(400).json
      ({ message: 'Error Returned' })
      sql.close()
   })
 

});
  module.exports = router;