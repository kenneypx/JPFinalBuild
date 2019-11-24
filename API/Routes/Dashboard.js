const express = require('express');
const router = express.Router();
const {ConnectionPool} = require('mssql')
const dbconfig = require('../SQLFunctions/config')


let config = dbconfig.config

router.get('/', (req, res, next) => {
    
  let Userid = req.query.UserName
  let Role = req.query.Role
  const sql = new ConnectionPool(config)
   sql.connect().then(pool => {
   // sql.connect(config).then(pool => {
         return pool.request()
        .input('EmployeeID', Userid)
        .input('Role',  Role)
       // .output('Return',sql.Int)
        .execute('sp_DT_Dashboard')
     }).then(result => {  
        //console.dir(result)
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
