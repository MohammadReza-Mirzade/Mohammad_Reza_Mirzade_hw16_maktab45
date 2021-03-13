const express = require("express");
const router = express.Router();
const employeeRouter = require('./employee');
const companyRouter = require('./company');
const extra = require('./extra');
const index = require('./index');
const success = require('./success');
const badReq = require('./badReq');


router.use('/employee', employeeRouter);
router.use('/company', companyRouter);
router.use('/extra', extra);
router.get('/', index);
router.get('/success', success);
router.get('/badReq', badReq);


module.exports = router;