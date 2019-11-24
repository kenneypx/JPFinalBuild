const nodemailer = require('nodemailer')
const sql = require('mssql/msnodesqlv8')
const dbconfig = require('../API/SQLFunctions/config')


let config = dbconfig.config

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'jpmailer3@gmail.com',
        pass:'HAPMAIL123'
    }
})

exports.sendReminder=function(){
    console.log('reminder Start')
    sql.connect(config).then(pool => {
        return pool.request()
       // .output('Return',sql.Int)
        .execute('sp_DT_GetReminder')
     }).then(result => {  
         // get first manager
        // console.log(result.recordset)
        sql.close()

         var RepList = []
          var compare = Number(0)
          var manager = Number(0)
         
          for (let count = 0; count< result.recordset.length; count ++){
               let mail = result.recordset[count]
               let entries = Object.entries(mail)
           //   var line=result.recordset[ro
            //  console.log(entries[2][1])
             if (manager==0){
               manager = entries[2][1] 
               console.log(manager +' type ' + typeof(manager))
             }
             if(manager != entries[2][1]  ){
              manager = entries[2][1]
              SendMail(manager,'Reminder',RepList)
                 RepList=[]
                 RepList.push({Salesrep:entries[0][1], name:entries[1][1]})
               //  console.log(RepList)
             } else{
                RepList.push({Salesrep:entries[0][1], name:entries[1][1]})
              //  console.log(RepList)
              }
              // Send the last email  if the count is full
          
        }

        SendMail(manager,'Reminder',RepList)

        
     }).catch(err => {
        console.log(err)
        res.status(400).json
        ({ message: 'Error Returned' })
        sql.close()
     })

}

function SendMail(sendto, subject, reps){

    let outputstr = ""
    for(var count=0; count<reps.length; count++){
        line = reps[count]
        var entries= Object.entries(line)
        outputstr = outputstr + `<tr><td>${entries[0][1]}</td><td>${entries[1][1]}</td></tr>`
        console.log(outputstr)
    }
    

const mailoptions = {
    from : 'jpmailer3@gmail.com',
    to: 'phil.kenney@gmail.com',
    subject: subject,
    html: `<br><p>You have the following Journey Plans to Approve.</p> \
    <table id="some_table_id">\
    <tr style="color:black;font-size:14px;border: 1px solid black;">\
    <th>Employee No</th><th>Name</th></tr>\
    ${outputstr}\
    </table>\
    </br>`
}

transporter.sendMail(mailoptions,function(err,res){
    if (err){
        console.log(err)
    } else {
        console.log('mail sent')
    }
})}

