const express = require('express');
const router = express.Router();
const upload = require ("../multer/multer");
const stagiaireController = require('../controller/stagiaire.controller');


//create, find, update, delete
router.get("/",stagiaireController.view);
router.get("/:id",stagiaireController.findone);


router.post("/liste-stagiaire",stagiaireController.find);


router.get("/",stagiaireController.form);
router.post("/inscript-stagiaire",upload.single('avatar'),stagiaireController.create);

router.get("/edit-stagiaire/:id",stagiaireController.editform);
router.post("/edit-stagiaire/:id",stagiaireController.modifie);


module.exports = router;