const express = require('express');
const router = express.Router();
const registerController = require('../controller/register.controller');


//create, find, update, delete

router.post("/inscription", registerController.create);

router.get("/",registerController.getALL);

module.exports = router;