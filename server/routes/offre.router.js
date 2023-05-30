
const express = require('express');
const router = express.Router();
const offreController = require('../controller/offre.controller');


//create, find, update, delete
router.get("/",offreController.view);
router.post("/",offreController.find);

router.post("/postule",offreController.postule);

router.get("/forms-entreprise",offreController.form);
router.post("/forms-entreprise",offreController.create);

router.get("/Mon_offre/:id",offreController.findoffrebyid)

router.get("/modifie-offre/:id",offreController.editform)

router.post("/edit-offreadmin/:id",offreController.edit);
router.get("/Delete-offreadmin/:id",offreController.delete);

router.get("/Delete-offre/:id",offreController.deleteoffre);
router.post("/edit-offre/:id",offreController.editoffre);


module.exports = router;



