const express = require("express");
const Router = express.Router();
const Company = require('../models/company');
const Employee = require('../models/employee');


Router.get('/', (req, res) => {
    Company.find({}, (err, companies) => {
        if (err) return res.status(500).json({msg: "Server Error :)", err: console.log(err.message)});
        res.render('company', {companies});
    });
});

Router.get('/:id', (req, res) => {
    Company.findById(req.params.id, (err, company) => {
        if (err) return res.status(500).json({msg: "Server Error :)", err: console.log(err.message)});
        Employee.find({company: req.params.id}, (err, employees)=>{
            if (err) return res.status(500).json({msg: "Server Error :)", err: console.log(err.message)});

            let d = new Date(company.registrationDate), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();
            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            res.render('companyPage', {company, employees, registrationDate: [year, month, day].join('-')});
        });
    });
});

Router.post('/create', (req, res) => {
    if (!req.body.name && !req.body.state && !req.body.city && !req.body.phoneNumber && !req.body.registrationDate) {
        return res.status(400).render('message', {message: "Bad Request :)"})
    };

    Company.findOne({registrationNumber: req.body.registrationNumber.trim()}, (err, company) => {
        if (err) return res.status(500).json({msg: "Server Error :)", err: console.log(err.message)});
        if (company) return res.status(406).render('message', {message: "Exist Company Name :("})
    
        const newCompany = new Company({
            name: req.body.name,
            state: req.body.state,
            city: req.body.city,
            phoneNumber: req.body.phoneNumber,
            registrationNumber: req.body.registrationNumber,
            registrationDate: req.body.registrationDate,
        });
    
        newCompany.save((err, company) => {
            if (err) return res.status(500).json({msg: "Server Error :)", err: console.log(err.message)});
            res.render('message', {message: 'The operation was successful.'});
        });
    });
});

Router.post('/update/:id', (req, res) => {
    if (!req.body.name && !req.body.state && !req.body.city && !req.body.phoneNumber && !req.body.registrationDate) {
        return res.status(400).render('message', {message: "Bad Request :)"})
    };
    Company.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, (err, company) => {
        if (err) return res.status(500).json({msg: "Server Error :)", err: console.log(err.message)});
        res.render('message', {message: 'The operation was successful.'});
    });
});

Router.get('/delete/:id', (req, res) => {
    Company.findOne({_id: req.params.id}, (err, company) => {
        if (err) return res.status(500).json({msg: "Server Error :)", err: console.log(err.message)});
        if (!company) return res.status(404).render('message', {message: "Not Found!"})
        company.deleteOne((err, company) => {
            if (err) return res.status(500).json({msg: "Server Error :)", err: console.log(err.message)});

            Employee.deleteMany({company: company._id}, err => {
                if (err) return res.status(500).json({msg: "Server Error :)", err: console.log(err.message)});
                res.render('message', {message: 'The operation was successful.'});
            });
        });
    });
});



module.exports = Router;