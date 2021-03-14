const express = require("express");
const router = express.Router();
const employeeRouter = require('./employee');
const companyRouter = require('./company');
const extra = require('./extra');
const index = require('./index');


router.use('/employee', employeeRouter);
router.use('/company', companyRouter);
router.use('/extra', extra);
router.get('/', index);


module.exports = router;