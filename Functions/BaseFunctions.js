const {ConnectionPool} = require('mssql')
const dbconfig = require('../API/SQLFunctions/config')
const XLSBuild = require('./ExcelBuild')
let config = dbconfig.config


var  d,previousmonth, currentmonth,dayscurrentmonth,dayslastmonth
var Headerline = [];
previousmonth = 8
currentmonth = 9


var d = new Date();
var year= d.getFullYear();

function getDaysLastMonth(previousmonth,year) {
    return new Date(year, previousmonth, 0).getDate();
};

function getDaysThisMonth(currentmonth,year) {
    return new Date(year, currentmonth, 0).getDate();
 };

 function getDayofWeek(datestr){
    // console.log(datestr)
     var stdate = new Date (datestr);
     //console.log(stdate)
     return stdate.getDay()

 }

function padding(number,padding,length){
   //     console.log(number)
    var numstr = number.toString()
    var retstring = padding.repeat(length)
    return retstring.slice(0,length - numstr.length)+ numstr

}

function printday(daycount){
    
    switch(daycount) {
    case 0 : return 'SU BLACK'
    
    case 1 : return 'MO WHITE'
   
    case 2 : return 'TU WHITE'
    
    case 3 : return 'WE WHITE'

    case 4 : return'TH WHITE'
  
    case 5 : return 'FR WHITE'

    case 6 : return 'SA BLACK'
    }
}




exports.HeaderFormat = function(lmonth, lyear){

    lmonth = Number(lmonth)
    lyear = Number(lyear)
  //  console.log(lmonth,lyear)
    var datestr = {}
    var daystr = {}
    var colourstr = {}
    var HeaderDate = {}
    var Startdate= {}
    var Enddate= {}
    var headercols = []
    var lastyear,nextyear, lastmonth, nextmonth
  
    var dateline = {}
    if(lmonth===1)
    { lastyear = lyear--
      lastmonth = 12
    nextyear = lyear
    nextmonth = Number(lmonth)+1
    }
    if (lmonth> 1 && lmonth<12){
        lastyear = lyear
        lastmonth = lmonth-1
        nextyear = lyear 
        nextmonth = Number(lmonth)+1;
    } 
    if(lmonth===12){
        nextmonth = Number(lmonth)+1
        nextyear = Number(lyear)+1
        lastyear = lyear
        lastmonth = lmonth-1
    }

   var dayslastmonth = getDaysLastMonth(lastmonth ,lastyear );
  
    var dayscurrentmonth = getDaysThisMonth(lmonth,lyear);

   // console.log(lmonth)
    var  startdatestr = lyear + '-' + padding(lmonth,'0',2) + '-'+ '01';
    var  enddatestr = lyear + '-' + padding(lmonth,'0',2) + '-'+ dayscurrentmonth.toString();
    var startofmonth = getDayofWeek(startdatestr);
    var endofmonth =getDayofWeek(enddatestr);
   
    daystofill = (startofmonth == 0) ? 0: startofmonth;
    daystopad = (endofmonth ===6)? 0: 6-endofmonth;
    var daycounter = 1;
    var spacefiller = 1;
    var totaldays = daystofill + dayscurrentmonth + daystopad
  
  //  console.log(dayslastmonth,dayscurrentmonth, startdatestr,startofmonth,daystofill)
    
    var daycount = 0

   for (var i = 0; i < totaldays; i++){
       if (daystofill > 0) {
        
        var lstr = padding( (dayslastmonth -daystofill) + 1,'0',2)
        var lmonthstr = padding(lastmonth,'0',2)
        var ldays = printday(daycount) 
         //   console.log (lstr + ldays)
         // JPHeaderline.push(lstr + + ldays )
         //  appliedstyle = (daycount===0||daycount===6) ? WeekendStyle : WeekdayStyle 
           datestr = {...datestr, [i+6]:lstr}
           daystr={...daystr,[i+6]:ldays.substr(0,2)}
           colourstr={...colourstr,[i+6]:'GREY'}

          // console.log(lmonthstr,lstr)
           HeaderDate={...HeaderDate,[i+6]:lyear.toString().concat(lmonthstr,lstr)}
           Startdate={...Startdate,[i+6]:startdatestr}
           headercols.push ({header:padding( dayslastmonth -daystofill,'0',2), key: 'coll'+ i , width: 3 })
           Enddate = {...Enddate,[i+6]:enddatestr}
           /* style: { font: { name: 'Arial Black' } } */
          // Headerline.push ( dayslastmonth -daystofill)
           daystofill -= 1
       } 
           else if (daycounter <= dayscurrentmonth) {
            var lstr = padding(daycounter,'0',2)
            var ldays =  printday(daycount) 
            var lmonthstr = padding(lmonth,'0',2)
        //    console.log (lstr + ' ' + ldays)
           // JPHeaderline.push(lstr + ' ' + ldays  )
           datestr = {...datestr, [i+6]:lstr}
           daystr={...daystr,[i+6]:ldays.substr(0,2)}
           colourstr={...colourstr,[i+6]:ldays.substr(3,7)}
           HeaderDate={...HeaderDate,[i+6]:lyear.toString().concat(lmonthstr,lstr)}
           Startdate={...Startdate,[i+6]:startdatestr}
           Enddate = {...Enddate,[i+6]:enddatestr}
          //  appliedstyle = (daycount===0||daycount===6) ? WeekendStyle : WeekdayStyle 
           headercols.push ({header: padding(daycounter,'0',2), key: 'coll'+ i , width: 3})  
           //  Headerline.push( daycounter.toString())
           daycounter +=1
       } 
       else {
        var lstr = padding(spacefiller,'0',2)
        var ldays =  printday(daycount)
        var lmonthstr = padding(nextmonth,'0',2)
        // JPHeaderline.push (lstr + ' ' + ldays)
        //  appliedstyle = (daycount===0||daycount===6) ? WeekendStyle : WeekdayStyle 
           headercols.push ({header: padding(spacefiller,'0',2) , key: 'coll'+ i , width: 3})
           datestr = {...datestr, [i+6]:lstr}
           daystr={...daystr,[i+6]:ldays.substr(0,2)}
           colourstr={...colourstr,[i+6]:'GREY'}
           HeaderDate={...HeaderDate,[i+6]:nextyear.toString().concat(lmonthstr,lstr)}
           Startdate={...Startdate,[i+6]:startdatestr}
           Enddate = {...Enddate,[i+6]:enddatestr}
           //Headerline.push( spacefiller.toString())
           spacefiller +=1
       }
          let label = 'coll'+ i
          //console.log('Day' + daycount)
         dateline[label] =  printday(daycount)  

          // console.log(dateline[label])
           daycount +=1;
           if (daycount ===7){
               //insert Blank column
               daycount = 0
           }
          
        //   console.log(HeaderDate)
       
   };
   
   const Resultline = {['dates']:datestr,['days']:daystr,['colours']:colourstr,['calldate']:HeaderDate,['startdate']: Startdate,['enddate']:Enddate}
return Resultline

}

exports.genExcelSheets = function(){
    const SalesRep = getSalesReps()
    for(let rep= 0; rep<SalesRep.length; rep++){
        console.log(SalesRep[0])
    }
}


function getSalesReps() {
    const sql = new ConnectionPool(config)
    console.log(config)
   sql.connect().then(pool => {

      return pool.request()
            .execute('sp_DT_GetReps')
       
   }).then(result => {  
       console.log('return'+ result)
      sql.close()
     return result.recordset
        
   }).catch(err => {
      console.log(err)
      sql.close()
     return 'ERROR'
     
   })

}
 



exports.getJPList =function getJPList(salespersonID) {
    const sql = new ConnectionPool(config)
    console.log('Hit Jorney Plan Get')
   sql.connect().then(pool => {
       console.log('Connected')
   // sql.connect(config).then(pool => {
      return pool.request()
      .input('SalesRep', salespersonID)
            .execute('sp_DT_GetOutletsbyRep')
       
   }).then(result => {  
      sql.close()
     return result.recordset
        
   }).catch(err => {
      console.log(err)
      sql.close()
     return 'ERROR'
     
   })
}

