

const express = require('express');
const sql = require('mssql/msnodesqlv8')
const dbconfig = require('../SQLFunctions/config')


const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://kenneyp:Singapore11@cluster0-oxfky.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });


const getUsers=()=>{
    console.log('connecting to Mongo')
    client.connect(err => {
        const collection = client.db("test").collection("devices");
       
        client.close();
      })}

  module.exports.getUsers = getUsers;