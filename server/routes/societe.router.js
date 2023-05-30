const express = require('express');
const router = express.Router();
const upload = require ("../multer/multer");
const societeController = require('../controller/societe.controller');


//create, find, update, delete

router.get("/",societeController.view);
router.post("/",societeController.find);

router.get("/:id",societeController.findone);
router.get("/delete/:id",societeController.delete);
router.post("/modifie-societe/:id",societeController.update);

router.get("/forms-gerant",societeController.form);
router.post("/forms-gerant",upload.single('url'),societeController.create);


module.exports = router;