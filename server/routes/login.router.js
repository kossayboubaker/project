const express = require('express');
const router = express.Router();
const loginController = require('../controller/login.controller');


//create, find, update, delete

router.post("/", loginController.create);



module.exports = router;