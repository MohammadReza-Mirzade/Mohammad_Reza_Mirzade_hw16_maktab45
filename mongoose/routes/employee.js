const express = require("express");
const Router = express.Router();
const Employee = require('../models/employee');
const Company = require('../models/company');



Router.get('/all', (req, res) => {
    Employee.find({}, {__v: 0}).limit(3).sort({name: -1}).lean().populate('company', {name: 1}).exec((err, products) => {
        if (err) return res.status(500).json({msg: "Server Error :)", err: err.message});
        res.json(products)
    });
});


Router.post('/create', (req, res) => {
    if (!req.body.company) {
        return res.status(400).json({msg: "Bad Request :)"})
    };

    Company.findById(req.body.company, (err, company) => {
        if (err) return res.status(500).json({msg: "Server Error :)", err: err.message});
        if (!company) return res.status(404).json({msg: "Not Found :)"})
    
        const newProduct = new Employee({
            lastName: req.body.lastName,
            firstName: req.body.firstName,
            nationalNumber: req.body.nationalNumber,
            beManager: req.body.beManager==="yes",
            gender: req.body.gender==="man",
            birthday: req.body.birthday,
            company: company._id
        });
    
        newProduct.save((err, product) => {
            if (err) return res.status(500).json({msg: "Server Error :)", err: err.message});
            res.json(product)
        });
    });
});

Router.get('/:employee', (req, res) => {
    Employee.findById(req.params.product, {__v: 0}).populate('company', {name: 1, _id: 0}).exec((err, product) => {
        if (err) return res.status(500).json({msg: "Server Error :)", err: err.message});
        res.json(product)
    })
})




module.exports = Router;