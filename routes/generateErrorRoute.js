const express = require("express");
const router = new express.Router();
const errorController = require("../controllers/errorController"); // week 3 generate-error

// route to intentionally generate an error
router.get("/", errorController.generateError);

module.exports = router;
