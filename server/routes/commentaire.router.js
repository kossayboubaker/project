const express = require('express');
const router = express.Router();
const commentaireController = require('../controller/commentaire.controller');


//create, find, update, delete
router.get("/",commentaireController.view);
router.post("/",commentaireController.create);

module.exports = router;