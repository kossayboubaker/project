const express = require('express');
const router = express.Router();

const gerantadminController = require('../controller/gerantadmin.controller');


//create, find, update, delete

router.get("/",gerantadminController.view);
router.post("/",gerantadminController.find);
router.get("/gerantadmin/ajoute-gerantadmin",gerantadminController.form);
router.post("/ajoute-gerantadmin",gerantadminController.create);


router.get("/modifie-gerantadmin/:id",gerantadminController.edit);
router.post("/modifie/:id",gerantadminController.update);
router.get("/supprime/:id",gerantadminController.delete);

router.get("/profile/:id",gerantadminController.profile);
module.exports = router;