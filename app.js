const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cron= require('node-cron')
const nodemailerControl = require('./Functions/nodemailerControl')
const jpFunctions= require('./Functions/BaseFunctions')
const ExcelBuild = require('./Functions/createExcel')
const fs = require('fs-extra')

const opts = {
    errorEventName:'error',
        logDirectory:'./mylogfiles', // NOTE: folder must exist and be writable...
        fileNamePattern:'roll-<DATE>.log',
        dateFormat:'YYYY.MM.DD'
};
const log = require('simple-node-logger').createRollingFileLogger( opts );



// const JPRoutes = require('./API/Routes/getJourneyplan');//
const dashboard = require('./API/Routes/Dashboard')
const plans = require('./API/Routes/getPlandata')
const JourneyPlan = require('./API/Routes/Journeyplan')
const JourneyPlanEdit = require('./API/Routes/JourneyplanEdit')
const Workflow = require('./API/Routes/Workflow')
const Usersync = require('./API/SQLFunctions/SyncUser')
const Reassign = require('./API/Routes/Reassign')
const ReviewPlan = require('./API/Routes/Review')
const JPLoad = require('./API/Routes/journeyplanload')
const Upload = require('./API/Routes/Upload')


const init = async () => {
    
    // this is a place holder for running responses  //
    // app.use('/JP',JPRoutes);
    //const userinfo = Usersync.getUsers()
    app.use('/Download',express.static('C:/Projects/JourneyPlan_NODE/Download/'))
    app.use(bodyParser.urlencoded({extended:false}))
    app.use(bodyParser.json())
    app.use((req,res,next) =>{
        log.info(req.url, new Date().toJSON());
    
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','*')
    if (req.method==='OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT, PATCH, GET, DELETE')
        return res.status(200).json({})
    }
    next();
    }),
    app.use('/Dashboard',dashboard);
    app.use('/Plans', plans);
    app.use('/JourneyPlan',JourneyPlan)
    app.use('/JourneyPlanAdd',JourneyPlan)
    app.use('/JourneyPlanEdit',JourneyPlanEdit)
    app.use('/JourneyPlanLoad',JPLoad)
    app.use('/Workflow',Workflow)
    app.use('/Manager',Reassign)
    app.use('/Review', ReviewPlan)
    app.use('/Upload',Upload)
}

init();
// <-- Add this to run the function defined above//

cron.schedule("4 1 1 * * *",function() {
    nodemailerControl.sendReminder()
   // console.log('Sending Reminders')
    ldate = new Date()
     ltime = ldate.getTime().toString()
   // console.log('Running ' + ltime )
})

cron.schedule("0 21 15 * *",function() {
   // get the list of Reps
   console.log('Generate started') 
   ExcelBuild.BuildExcel()
   //Create the Excel Sheets and place in the Folder

})


cron.schedule("1 * 1 * *",function() {
    // get the list of Reps
    fs.emptyDir('C:/Projects/JourneyPlan_NODE/Download/')
    .then(() => {
        console.log('Empty Folder Success')
      })
      .catch(err => {
        console.error(err)
      })    
    //Create the Excel Sheets and place in the Folder
 
 })
module.exports = app;
