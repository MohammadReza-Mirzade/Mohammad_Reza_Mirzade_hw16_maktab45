const express = require("express");
const Router = express.Router();
const Employee = require('../models/employee');
const Company = require('../models/company');



Router.get('/all', (req, res) => {
    Employee.find({}, {__v: 0}).limit(3).sort({name: -1}).lean().populate('company', {name: 1}).exec((err, products) => {
        if (err) return res.status(500).json({msg: "Server Error :)", err: console.log(err.message)});
        res.render('message', {products});
    });
});


Router.post('/create', (req, res) => {
    if (!req.body.lastName && !req.body.firstName && !req.body.city && !req.body.nationalNumber && !req.body.beBoss && !req.body.company && !req.body.gender && !req.body.bigint) {
        return res.status(400).render('message', {message: "Bad Request :)"})
    };
    Employee.findOne({nationalNumber: req.body.nationalNumber.trim()}, (err, employee) => {
        console.log(req.body.company);
        if (err) return res.status(500).json({msg: "Server Error :)", err: console.log(err.message)});
        if (employee) return res.status(406).render('message', {message: "Exist employee :("})
        Company.findById(req.body.company.trim(), (err, company) => {
            if (err) return res.status(500).json({msg: "Server Error :)", err: console.log(err.message)});
            if (!company) return res.status(406).render('message', {message: "Company doesn't exist :("})

            const newProduct = new Employee({
                lastName: req.body.lastName,
                firstName: req.body.firstName,
                nationalNumber: req.body.nationalNumber,
                beBoss: req.body.beBoss === "yes",
                gender: req.body.gender === "man",
                birthday: req.body.birthday,
                company: company._id
            });

            newProduct.save((err, product) => {
                if (err) return res.status(500).json({msg: "Server Error :)", err: console.log(err.message)});
                    res.render('message', {message: 'The operation was successful.'});
                });
        });
    });
});

Router.get('/:employee', (req, res) => {
    Employee.findById(req.params.employee, {__v: 0}).populate('company', {name: 1, _id: 1}).exec((err, employee) => {
        if (err) return res.status(500).json({msg: "Server Error :)", err: console.log(err.message)});

        let d = new Date(employee.birthday), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        res.render('employee', {employee:employee, birthday: [year, month, day].join('-')});
    });

});

Router.post("/update/:id", (req, res) => {
    if (!req.body.lastName && !req.body.firstName && !req.body.city && !req.body.nationalNumber && !req.body.beBoss && !req.body.company && !req.body.gender && !req.body.bigint) {
        return res.status(400).render('message', {message: "Bad Request :)"});
    };
    Employee.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, (err, employee) => {
        if (err) return res.status(500).json({msg: "Server Error :)", err: console.log(err.message)});
        res.render('message', {message: 'The operation was successful.'});
    });
});

Router.get('/delete/:id', (req, res) => {
    Employee.findById(req.params.id, (err, employee) => {
        if (err) return res.status(500).json({msg: "Server Error :)", err: console.log(err.message)});
        if (!employee) return res.status(405).json({msg: "The Employee Not Found!"});
        Employee.findByIdAndDelete(req.params.id, (err, employee) => {
            if (err) return res.status(500).json({msg: "Server Error :)", err: console.log(err.message)});
            res.render('message', {message: 'The operation was successful.'});
        });
    });
});



module.exports = Router;