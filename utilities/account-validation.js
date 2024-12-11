const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}


/*  **********************************
  *  week 4 => Registration Data Validation Rules
  * ********************************* */
validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), 
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."),
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() 
      .withMessage("A valid email is required."),

      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }

/* ******************************
 * week 4 => Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}


/*  **********************************
  *  week 5 => Login process (from accountRoute) loginRules
  * ********************************* */
validate.loginRules = () => {
  return [
    // valid email is required and cannot already exist in the DB
    body("account_email")
    .trim()
    .escape()
    .notEmpty()
    .isEmail()
    .normalizeEmail() 
    .withMessage("A valid email is required."),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
 * week 5 => checking login data (from accountRoute) 
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    return res.status(400).render("account/login", {
      errors: errors.array(),
      nav,
      title: "Login",
      account_email: req.body.account_email,
    });
  }

  next(); 
}; 



/* ******************************
 * week 5 assignemnt => validation
 * ***************************** */
const regValidate = {
  // updating account details
  updateAccountRules: () => [
    body("email")
      .isEmail().withMessage("Please enter a valid email address")
      .normalizeEmail(),
    body("name")
      .notEmpty().withMessage("Name is required")
      .trim()
      .escape(),
    // other fields that need to be validated for updating account
    body("phone")
      .optional()
      .isMobilePhone().withMessage("Please enter a valid phone number"),
  ],

  // changing password validation
  changePasswordRules: () => [
    body("currentPassword")
      .notEmpty().withMessage("Current password is required"),
    body("newPassword")
      .notEmpty().withMessage("New password is required")
      .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    body("confirmPassword")
      .notEmpty().withMessage("Please confirm your new password")
      .custom((value, { req }) => value === req.body.newPassword)
      .withMessage("Passwords do not match"),
  ],

  // middleware to handle validation errors
  handleValidationErrors: async (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      // rendering the views
      let nav = await utilities.getNav(); 
      return res.status(400).render("account/update", {
        errors: errors.array(),
        nav,
        title: "Update Account",
        accountData: req.body,
      });
    }
    
    next();
  },
};

module.exports = regValidate;



module.exports = validate