const express = require('express');
const router = express.Router();
const candidatureController = require('../controller/candidature.controller');


//create, find, update, delete
router.get("/",candidatureController.getALL);
router.get("/:id",candidatureController.getById);
router.post("/", candidatureController.create);
router.post("/updateStatus/:id", candidatureController.update);
router.delete("/:id", candidatureController.delete);


module.exports = router;
