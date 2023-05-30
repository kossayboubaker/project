const express = require('express');
const router = express.Router();
const commentaireadminController = require('../controller/commentaireadmin.controller');


//create, find, update, delete
router.get("/",commentaireadminController.view);
router.post("/",commentaireadminController.find);

router.get("/ajouter-commentaireadmin",commentaireadminController.form);
router.post("/ajouter-commentaireadmin",commentaireadminController.create);
router.post("/commentaireadmin/modifie-commentaireadmin/:id",commentaireadminController.modifie);
router.get("/modifie-commentaireadmin/:id",commentaireadminController.edit);
router.get("/Delete-commentaireadmin/:id",commentaireadminController.delete )
module.exports = router;