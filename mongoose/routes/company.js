const express = require("express");
const Router = express.Router();
const Company = require('../models/company');
const Employee = require('../models/employee');


Router.get('/', (req, res) => {
    Company.find({}, (err, companies) => {
        if (err) return res.status(500).json({msg: "Server Error :)", err: err.message});
        res.render('company', {companies});
    });
});

Router.get('/:id', (req, res) => {
    Company.findById(req.params.id, (err, company) => {
        if (err) return res.status(500).json({msg: "Server Error :)", err: err.message});
        Employee.find({company: req.params.id}, (err, employees)=>{
            if (err) return res.status(500).json({msg: "Server Error :)", err: err.message});
            res.render('companyPage', {company, employees});
        });
    });
});

Router.post('/create', (req, res) => {
    if (!req.body.name) {
        return res.status(400).json({msg: "Bad Request :)"})
    };

    Company.findOne({name: req.body.name.trim()}, (err, existCompany) => {
        if (err) return res.status(500).json({msg: "Server Error :)", err: err.message});
        if (existCompany) return res.status(406).json({msg: "Exist Company Name :("})
    
        const newCompany = new Company({
            name: req.body.name,
            state: req.body.state,
            city: req.body.city,
            phoneNumber: req.body.phoneNumber,
            registrationNumber: req.body.registrationNumber,
            registrationDate: req.body.registrationDate,
        });
    
        newCompany.save((err, company) => {
            if (err) return res.status(500).json({msg: "Server Error :)", err: err.message});
            res.redirect("/successNewCompany");
        })
    })
});

Router.post('/update/:id', (req, res) => {
    Company.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, (err, company) => {
        if (err) return res.status(500).json({msg: "Server Error :)", err: err.message});
        res.redirect("/successUpdateCompany", company);
    });
});

Router.post('/delete/:id', (req, res) => {
    Company.findOne({_id: req.params.id}, (err, company) => {
        if (err) return res.status(500).json({msg: "Server Error :)", err: err.message});
        if (!company) return res.status(404).json({msg: "Not Found!"})
        company.deleteOne((err, company) => {
            if (err) return res.status(500).json({msg: "Server Error :)", err: err.message});

            Employee.deleteMany({company: company._id}, err => {
                if (err) return res.status(500).json({msg: "Server Error :)", err: err.message});
                res.redirect("successDeleteCompany")
            });
        });
    });
});



module.exports = Router;