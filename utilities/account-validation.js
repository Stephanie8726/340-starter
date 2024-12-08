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


// validate.checkUpdateData = async (req, res, next) => {
//   const errors = validationResult(req);
  
//   if (!errors.isEmpty()) {
//     const nav = await utilities.getNav();
//     return res.render("inventory/editInventory", {
//       title: "Edit Inventory",
//       errors: errors.array(),
//       nav,
//       ...req.body,
//     });
//   }

//   next();
// };

// Copy of checkInventoryData function but renamed to checkUpdateData
function checkUpdateData(req, res, next) {
  // Define validation rules
  const { inv_make, inv_model, inv_description, inv_price, inv_year, inv_miles, inv_color, classification_id } = req.body;

  let errors = [];

  if (!inv_make || !inv_model || !inv_price || !inv_year) {
    errors.push("Please fill out all required fields.");
  }

  // Return to edit view if errors are found
  if (errors.length > 0) {
    res.render("inventory/edit-inventory", {
      title: "Edit Inventory Item",
      errors: errors,
      ...req.body, // Pass back the data including inv_id
    });
    return;
  }

  next();
}



module.exports = validate