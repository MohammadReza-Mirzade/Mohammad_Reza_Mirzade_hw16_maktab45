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
    if (!req.body.lastName && !req.body.firstName && !req.body.city && !req.body.nationalNumber && !req.body.beBoss && !req.body.company && !req.body.gender && !req.body.bigint) {
        return res.status(400).json({msg: "Bad Request :)"})
    };
    Company.findOne({nationalNumber: req.body.nationalNumber.trim()}, (err, Company) => {
        if (err) return res.status(500).json({msg: "Server Error :)", err: err.message});
        if (Company) return res.status(406).json({msg: "Exist employee :("})
        Company.findById(req.body.company, (err, company) => {
            if (err) return res.status(500).json({msg: "Server Error :)", err: err.message});
            if (company) return res.status(406).json({msg: "Company doesn't exist :("})

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
                if (err) return res.status(500).json({msg: "Server Error :)", err: err.message});
                res.redirect("/success");
            });
        });
    });
});

Router.get('/:employee', (req, res) => {
    Employee.findById(req.params.employee, {__v: 0}).populate('company', {name: 1, _id: 0}).exec((err, employee) => {
        if (err) return res.status(500).json({msg: "Server Error :)", err: err.message});

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
        return res.status(400).json({msg: "Bad Request :)"})
    };
    Employee.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, (err, employee) => {
        if (err) return res.status(500).json({msg: "Server Error :)", err: err.message});
        res.redirect("/success");
    });
});

Router.post('/delete/:id', (req, res) => {
    Employee.findOne({_id: req.params.id}, (err, employee) => {
        if (err) return res.status(500).json({msg: "Server Error :)", err: err.message});
        if (!employee) return res.status(404).json({msg: "Not Found!"});
        employee.deleteOne((err, employee) => {
            if (err) return res.status(500).json({msg: "Server Error :)", err: err.message});
            res.redirect("/success");
        });
    });
});



module.exports = Router;