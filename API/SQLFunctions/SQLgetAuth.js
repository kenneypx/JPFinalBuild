const sql = require('mssql');

const dbconfig = {
  user: 'DSI',
  password: 'DSI',
  server: 'localhost',
  database: 'SG_WIRE_PRD',
  options: {
    encrypt: true
  }
}


function getAuth(userID, password) {
  return new Promise(async function(resolve, reject) {
    let pool = new sql.ConnectionPool(dbconfig);// Declared here for scoping purposes.
    try {  
      console.log('starting query')
       pool.connect(err => {console.log(err)})
        
        console.log('connected') 
          //3.
          const request = new sql.Request(pool);
          request.input('Username', sql.NVarChar(10), userID)
          request.input('Password', sql.NVarChar(10), password)
           console.log('Exec Procedure')
          request.execute("sp_DT_CheckAuth")
          
          .then(function (recordSet) {err 
            //4.
            console.log(recordSet);
            resolve('123')
            
      })
      .catch(err=> console.log('Connection Catch Failed to connect: Err:' + err))
    }
   catch (err) {
    console.log('Catch Block:Error occurred', err);
    reject(err);
  } finally {
    
    // If conn assignment worked, need to close.
    if (pool) {
      try {
        await pool.close();
        console.log('Connection closed');
      } catch (err) {
        console.log('Error closing connection', err);
      }
    }
  }
});



}
module.exports.getAuth = getAuth;