const express = require('express');
const router = express.Router();
const upload = require ("../multer/multer");
const societeadminController = require('../controller/societeadmin.controller');


//create, find, update, delete
router.get("/",societeadminController.view);
router.post("/",societeadminController.find);

router.get("/ajoute-societeadmin",societeadminController.form);
router.post("/ajoute-societeadmin",upload.single('url'),societeadminController.create);
router.get("/count",societeadminController.compte);
router.get("/modifie-societeadmin/:id",societeadminController.edit);

module.exports = router;