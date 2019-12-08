const express = require('express');
const router = express.Router();
const {ConnectionPool} = require('mssql')
const dbconfig = require('../SQLFunctions/config')
//const config = require('../../config');
// Change  Coonfig entries //
let config = dbconfig.config

router.get('/', (req, res, next) => {
    
  let PlanID = req.query.PlanID
   
  const sql = new ConnectionPool(config)
  //  console.log('Hit Jorney Plan Get')
   sql.connect().then(pool => {
        return pool.request()
        .input('PlanID', PlanID)
       
        .execute('sp_DT_Manager_Select')
     }).then(result => {  
         sql.close()
     //   let resultset = result.recordset[0].push(result.recordset[1])
     //  console.dir(result.recordset[0])
        res.status(200).json
        ({ 
            data :result.recordset
            })
       
     }).catch(err => {
        console.log(err)
        res.status(400).json
        ({ message: 'Error Returned' })
        sql.close()
     })
    
})

router.post('/', (req, res, next) => {
    
   let PlanID = req.query.PlanID
   let Manager= req.query.ManagerID
    
   const sql = new ConnectionPool(config)
    console.log(req.url)
    sql.connect().then(pool => {
         return pool.request()
         .input('PlanID',  PlanID)
         .input('Manager' , Manager)
        
         .execute('sp_DT_Reassign')
      }).then(result => {  
          sql.close()
      
         res.status(200).json
         ({ 
             message: 'Updated'
             })
        
      }).catch(err => {
         console.log(err)
         res.status(400).json
         ({ message: 'Error Returned',
         detail:err})
         console.error(err);
            return res.status(500).json({error: err.code});
         sql.close()
      })
    
 
     
 })
 

    module.exports = router;
