const sql = require('mssql/msnodesqlv8')
const XLSX = require('@sheet/edit')
const dbconfig = require('../API/SQLFunctions/config')


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
                let lastRep = reps[0].SalesRep
                 for(let counter=0; counter<reps.length;counter++){
                     if (reps[counter].SalesRep === lastRep){
                            Outlets.push([reps[counter].OutletID, reps[counter].OutletName,reps[counter].CallRate,reps[counter].Address])
                          //  console.log (reps[counter].OutletID )
                     } else{
                        
                      // const data =  XLSX.utils.sheet_to_json(worksheet)
                      // console.log(worksheet)
                       salespersonID = Outlets[0][0]
                       let Year = 2019
                       let Month = 12
                       let rows = Outlets.length + 5
                       const OutDir = 'C:/Projects/JourneyPlan_NODE/Download/'

                     // console.log(Outlets)
                       XLSX.utils.template_set_aoa(workbook, Summary, "D3", [[salespersonID]]);
                       XLSX.utils.template_set_aoa(workbook, Summary, "T5", [[Year]]);
                       XLSX.utils.template_set_aoa(workbook, Summary, "S7", [[Month]]);
                       let range =  {s:{r:5,c:51},e:{r:5,c:54}}
                        XLSX.utils.template_set_aoa(workbook,JP, {s:{r:5,c:51},e:{r:rows,c:55}},Outlets);
                        let filename = salespersonID + '_' +Year.toString() + Month.toString()+'.xlsm'
                        XLSX.writeFile(workbook,OutDir+ filename,{template: true});
                        lastRep = reps[counter].SalesRep
                        Outlets= []
                       // console.log(filename)
                     }

                 }

             }).catch(err => {
                console.log(err)
                sql.close()
             })
    
        }
    

        

    


    exports.BuildExcel = function () {

         getreps()
            
    
        
    }