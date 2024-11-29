const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");

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
  utilities.handleErrors(accountController.registerAccount)
);

router.post(
  "/login", 
  utilities.handleErrors(accountController.handleLogin)); // handle login form submission

module.exports = router;

