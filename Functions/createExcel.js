const sql = require('mssql/msnodesqlv8')
const XLSX = require('@sheet/edit')
const dbconfig = require('../API/SQLFunctions/config')
const moment = require('moment')

let config = dbconfig.config


// Get list of Files in Directory


function getreps(){
    // get list of Sales Reps
     
            sql.connect(config).then(pool => {
                return pool.request()
                .execute('sp_DT_GetOutletsbyRep')
             }).then(result => {  
              // console.dir(result)
                sql.close()
                console.log('opening Template')
                const workbook = XLSX.readFile('C:/Projects/JourneyPlan_NODE/Functions/Template/Template.xlsm', { bookVBA: true , cellDates:true ,template:true});
                //console.log(workbook.Sheets)
                let JP = workbook.Sheets['JP'];
                let Summary = workbook.Sheets['Summary']
          
                let Outlets = []
                reps = result.recordset
               // console.log(reps)
              var lastRep = reps[0].SalesRep
               

                console.log(lastRep)
                 for(let counter=0; counter<reps.length;counter++){
                  // console.log(reps[counter].SalesRep)
                     if (reps[counter].SalesRep === lastRep){
                            Outlets.push([reps[counter].OutletID, reps[counter].OutletName,reps[counter].CallRate,reps[counter].Addr1,reps[counter].Addr2,reps[counter].Postcode, ,reps[counter].OutletType])
                          //  console.log (reps[counter].OutletID )
                     } else{

                       
                      // const data =  XLSX.utils.sheet_to_json(worksheet)
                      // console.log(worksheet)
                     // console.log(Outlets[0])
                      let salespersonID = lastRep
                      // salespersonID = Outlets[0][0]
                       console.log(salespersonID)
                       var d = new Date();

                       let planDate = moment().add(1, 'months').calendar();
                       let Year = planDate.getFullYear()
                       let Month = planDate.getMonth() 
                       //console.log(Year, Month)
                       let rows = Outlets.length + 5
                       const OutDir = 'C:/Projects/JourneyPlan_NODE/Download/'

                     // console.log(Outlets)
                       XLSX.utils.template_set_aoa(workbook, Summary, "D3", [[salespersonID]]);
                       XLSX.utils.template_set_aoa(workbook, Summary, "T5", [[Year]]);
                       XLSX.utils.template_set_aoa(workbook, Summary, "S7", [[Month]]);
                       let range =  {s:{r:5,c:51},e:{r:5,c:54}}
                        XLSX.utils.template_set_aoa(workbook,JP, {s:{r:5,c:51},e:{r:rows,c:58}},Outlets);
                        let filename = salespersonID + '_' +Year.toString() + Month.toString()+'.xlsm'
                        XLSX.writeFile(workbook,OutDir+ filename,{template: true});
                        lastRep = reps[counter].SalesRep
                       
                       // console.log(filename)
                     }

                 }

             }).catch(err => {
                console.log(err)
                sql.close()
             })
    
        }
    

        

    


    exports.BuildExcel = function () {
      fs.unlink('C:/Projects/JourneyPlan_NODE/Download/', (err) => {
        if (err) throw err;
        console.log('successfully deleted Downloads Folder');
      });

         getreps()

    }