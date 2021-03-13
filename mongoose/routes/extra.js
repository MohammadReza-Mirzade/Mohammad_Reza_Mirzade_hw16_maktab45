const express = require("express");
const Router = express.Router();
const Company = require('../models/company');
const Employee = require('../models/employee');

Router.get('/2', function (req, res){
    let date = new Date(Date.now());
    date.setFullYear(date.getFullYear()-1);
    Company.find({registrationDate: {$gt: date}}, (err, companies) => {
        if (err) return res.status(500).json({msg: "Server Error :)", err: err.message});
        res.send(companies);
    });
});

Router.get('/3', function (req, res){
    let date = new Date(Date.now());
    date.setFullYear(date.getFullYear()-20);
    let data1 = date;
    date.setFullYear(date.getFullYear()-10);
    Employee.find({birthday: {$not: {$and : [{$gt: date},{$lt: data1}]}}}, {'_id':0}, (err, companies) => {
        if (err) return res.status(500).json({msg: "Server Error :)", err: err.message});
        res.send(companies);
    });
});

Router.get('/4', function (req, res){
    Employee.find({beBoss: true},  (err, companies) => {
        if (err) return res.status(500).json({msg: "Server Error :)", err: err.message});
        res.send(companies);
    });
});

Router.get('/5', function (req, res){
    Company.updateMany({}, {city: "Tehran", state: "Tehran"}, (err, companies) => {
        if (err) return res.status(500).json({msg: "Server Error :)", err: err.message});
        res.send(companies);
    });
});


module.exports = Router;