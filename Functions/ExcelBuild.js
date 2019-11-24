const fs = require('fs')
const XLSX = require('@sheet/edit')



exports.CreateExcel= function(SalesPersonID,Outlets,Month,Year){
    const workbook = XLSX.readFile('Template\Template.xlsm', { bookVBA: true , cellDates:true ,template:true});
    let JP = workbook.Sheets['JP'];
    let Summary = workbook.Sheets['Summary']
    XLSX.utils.template_set_aoa(workbook, Summary, "D3", [[SalesPersonID]]);
    XLSX.utils.template_set_aoa(workbook, Summary, "T5", [[Year]]);
    XLSX.utils.template_set_aoa(workbook, Summary, "S7", [[Month]]);
    let row = 6 
    for(let counter= 0; counter< Outlets.count; counter++){
        XLSX.utils.template_set_aoa(workbook, JP, {s: { r:row, c:51 }, e: { r:row, c:54 }}, [[1,2,3]]);   
    }

}