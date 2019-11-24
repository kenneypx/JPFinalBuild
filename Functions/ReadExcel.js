const fs = require('fs')
const XLSX = require('xlsx')
const moment = require('moment')
const sql = require('mssql/msnodesqlv8')
const dbconfig = require('../API/SQLFunctions/config')

let config = dbconfig.config
var newentry = {}
var ToProcess = []
var filename, SalesRep,Month,Year

// Get list of Files in Directory
var walk = function(dir) {
    var results = [];
    var list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            /* Recurse into a subdirectory */
            results = results.concat(walk(file));
        } else { 
            /* Is a file */
            results.push(file);
        }
    });
    return results;
}


exports.ReadExcel = function(){
// get list of files from 
const filelist = walk('../Files/Inbound')
//console.log(filelist)
for (let filecounter=0; filecounter<filelist.length; filecounter++){
    let filename = filelist[filecounter]
    let subset = filename.replace('../Files/Inbound/','')
    console.log(subset)
    SalesRep = subset.substr(0,subset.indexOf('_'))
    let startdate =  subset.substr(subset.indexOf('_')+1,6)
    Month =  subset.substr(0,2)
    Year = subset.substr(3,4)
    let lstdate = new Date(startdate.substr(2,4)+'-'+startdate.substr(0,2)+'-'+'01')
    let lenddate =new Date(startdate.substr(2,4)+'-'+(Number(startdate.substr(0,2)) + 1)+'-'+'01')

 
    try {
        const workbook = XLSX.readFile(filename, { bookVBA: true , cellDates:true});
        //console.log(workbook.Sheets)
        let worksheet = workbook.Sheets['JP'];
        const data =  XLSX.utils.sheet_to_json(worksheet)
        console.log(data)

        for(var r=0; r<data.length;r++){
            var record = data[r]
            var OutletID = record.__EMPTY_5
            for (let [key, value] of Object.entries(record)) {
                if (value==="a"){
                newentry = {date:key, outlet:OutletID, startdate:moment(lstdate).format('YYYYMMDD'), enddate:moment(lenddate).format('YYYYMMDD')}
                ToProcess.push(newentry)
                }
            }   
        }
   
        // insert into SQL
       // console.log(ToProcess)

        // load to SQL
        console.log(SalesRep)
        const sql = new ConnectionPool(config)
         sql.connect().then(pool => {
         
           return pool.request()
           .input('SalesRep',  SalesRep)
           .input('JOURNEYPLAN', JSON.stringify(ToProcess))
          // .output('Return',sql.Int)
           .execute('sp_DT_Insert_to_JP')
         }).then(result => {  
            //console.dir(result)
            sql.close()
         }).catch(err => {
            console.log(err)
            sql.close()
         })

       } catch (error) {
            console.log(error.message);
            console.log(error.stack);
        } finally{
            Secondsheet()
        }
    }
}

function Secondsheet(){  
  
    const workbook = XLSX.readFile(filename, { bookVBA: true , cellDates:true});     
    console.log('Starting second Proces') 
  let worksheet2 = workbook.Sheets['Uploadsheet'];
  const data2 = XLSX.utils.sheet_to_row_object_array(worksheet2)
  //  const data =  XLSX.utils.sheet_to_row_object_array(workbook.Sheets[worksheet])
  let Uploadset = []
  //console.log(data)
  
   PlanID= data2[0]['1']
   //console.log(PlanID)
   for(let row = 1; row<data2.length;row++){
     if(data2[row][2]>1000 && data2[row].length != 0){
       Uploadset.push(data2[row])
      
     }
   }
  console.log(JSON.stringify(Uploadset))
  const sql = new ConnectionPool(config)
  sql.connect(config).then(pool => {
     return pool.request()
     .input('SalesRep',  SalesRep)
     .input('Month',Month)
     .input('Year',Year)
     .input('PlanID',PlanID)
     .input('JOURNEYPLAN', JSON.stringify(Uploadset))
    // .output('Return',sql.Int)
     .execute('sp_DT_Insert_HoldingTable_JSON')
  }).then(result => {  
     //console.dir(result)
    console.log('completed')
    movefile()
     sql.close()
  }).catch(err => {
     console.log(err)
  
     sql.close()
  })
  
  
  }

  function movefile(){
        fs.copyFileSync(filename,'../Files/Inbound/Processed',)

  }