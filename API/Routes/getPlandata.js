const express = require('express');
const router = express.Router();
const sql = require('mssql');

//const config = require('../../config');
// Change  Coonfig entries //


    router.get('/', (req, res, next) => {
        const SalesRep = req.query.SalesRep
    const SalesManager = req.query.SalesManager
         res.status(200).json({message: 'success'})
     });



    router.post('/', (req, res, next) => {
        const Action = req.query.Action
        const SalesRep = req.query.SalesRep
        const WeekFrom = req.query.WeekFrom
        const WeekTo= req.query.WeekTo
        res.status(200).json({message: 'success'})
    });
    module.exports = router;
