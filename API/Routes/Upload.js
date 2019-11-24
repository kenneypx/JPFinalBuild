const express = require('express')
const router = express.Router();
const multer = require('multer')
const ExcelReader = require('../../Functions/ReadExcel')

const fileFilter= (req,fileFilter,cb)=>{
    if(fileFilter.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
        cb(null,true)
    } else {
        cb(null,false)
    }
}

const storage = multer.diskStorage({
    destination: function(req,file,callback){
        callback(null,'upload/')
    },
    filename:function(req,file,callback){
        callback(null,file.originalname)
    }
})

const upload = multer({storage:storage,
fileFilter:fileFilter
})




router.post('/',upload.single('file'),(req,res,next)=> {
  //  console.log(req.file)

   // console.log(typeof(req.file)==='undefined')
    if(typeof(req.file)==='undefined'){
    res.status(400).json({
       message:'filetype not Accepted'
    })}
    else {
        ExcelReader.ReadExcel()
        res.status(200).json({
            message:'file uploaded successfully'
    })}
}
)
   

module.exports = router;
