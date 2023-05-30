const express = require('express');
const router = express.Router();
const upload = require ("../multer/multer");
const stagiaireadminController = require('../controller/stagiaireadmin.controller');


//create, find, update, delete
router.get("/",stagiaireadminController.view);
router.post("/",stagiaireadminController.find);
router.get("/formstagiaire-admin",stagiaireadminController.form);
router.post("/formstagiaire-admin",upload.single('avatar'),stagiaireadminController.create);

router.post("/modifie-stagiaireadmin/:id",stagiaireadminController.modifie);
router.get("/modifie-stagiaireadmin/:id",stagiaireadminController.edit);
router.get("/delete-stagiaireadmin/:id",stagiaireadminController.delete);
//router.get("/modifie-stagiaireadmin/:id",stagiaireadminController.editform);


module.exports = router;