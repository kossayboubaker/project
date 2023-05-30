const express = require('express');
const router = express.Router();
const offreadminController = require('../controller/offreadmin.controller');


//create, find, update, delete

//create, find, update, delete
router.get("/",offreadminController.view);
router.post("/", offreadminController.find);
router.get("/publier-offre",offreadminController.form);
router.post("/publier-offre",offreadminController.create);

router.get("/edit-offreadmin/:id",offreadminController.edit);

module.exports = router;