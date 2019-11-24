const express = require('express');
const router = express.Router();
const sql = require('mssql/msnodesqlv8')
const dbconfig = require('../SQLFunctions/config')


let config = dbconfig.config

router.get('/', (req, res, next) => {
    
    let userid = req.query.UserID
    let password = req.query.Password
    //console.log(req)
    sql.connect(config).then(pool => {
        return pool.request()
        .input('Username', sql.NVarChar(10), userid)
        .input('Password', sql.NVarChar(10), password)
       // .output('Return',sql.Int)
        .execute('sp_DT_CheckAuth')
     }).then(result => {  
        console.dir(result)
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

sql.on('error', err => {
    sql.close()
    console.log(err)
})
   

module.exports = router;
