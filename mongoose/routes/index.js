const express = require("express");
const Router = express.Router();

Router.use('/' , function (req, res){
    res.render('index');
});

module.exports = Router;