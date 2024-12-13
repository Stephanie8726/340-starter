const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const errorController = require("../controllers/errorController"); // week 3 generate-error
const regValidate = require("../utilities/account-validation");
const validate = require("../utilities/account-validation");

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
  regValidate.loginRules(), // week 5
  regValidate.checkLoginData, // week 5
  utilities.handleErrors(accountController.handleLogin)
);

// week 5
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildManagement)
);

// week 5 assignment => get the update account view
router.get(
  "/update/:account_id",
  utilities.checkLogin,
  accountController.updateAccountView
);

// update account
router.post(
  "/update",
  regValidate.updateAccountRules(),
  validate.checkAccountUpdateData,
  accountController.updateAccount
);

// change password
router.post(
  "/passwordUpdate",
  regValidate.updatePasswordRules(),
  validate.checkUpdateAccountPassword,
  accountController.changePassword
);

//account logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("jwt");
    res.redirect("/account/login");
  });
});

module.exports = router;
