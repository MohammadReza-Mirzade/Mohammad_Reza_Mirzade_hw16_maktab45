const express = require("express");
const Router = express.Router();

Router.use('/' , function (req, res){
    res.render('success');
});

module.exports = Router;