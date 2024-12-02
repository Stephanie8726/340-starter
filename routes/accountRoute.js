const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require('../utilities/account-validation')
const errorController = require("../controllers/errorController"); // week 3 generate-error

// Route to intentionally generate an error
router.get("/generate-error", errorController.generateError);

// week4 => deliver login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// week4 => deliver registration view
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

// week4 => process registration
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

router.post(
  "/login", 
  utilities.handleErrors(accountController.handleLogin));

module.exports = router;

