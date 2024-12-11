const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // week 5
require("dotenv").config(); // week 5

/* ****************************************
 *  Deliver Login View
 * **************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  console.log("=>", req.flash());
  res.render("account/login", {
    title: "Login",
    nav,
    messages: req.flash(),
  });
}

/* ****************************************
 *  Deliver Register View
 * **************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    // console.log("=> ", req.flash())
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      messages: req.flash(),
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  Week 5 Process login request
 * ************************************ */
async function handleLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect("/account/");
    } else {
      req.flash(
        "message notice",
        "Please check your credentials and try again."
      );
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
        messages: req.flash(),
      });
    }
  } catch (error) {
    throw new Error("Access Forbidden");
  }
}

/* ****************************************
 *  Week 5 => Deliver Management View
 * **************************************** */
async function buildManagement(req, res, next) {
  try {
    let nav = await utilities.getNav();
    const accountEmail = res.locals.accountData.account_email;

    const accountData = await accountModel.getAccountByEmail(accountEmail);
    console.log(" =>", accountEmail);
    console.log(" =>", accountData);

    res.render("account/management", {
      user: accountEmail,
      nav,
      accountType: accountData.account_type,
      title: "Account Management",
      messages: req.flash(),
      errors: null,
    });
  } catch (err) {
    console.error("Error rendering management page:", err);
    next(err);
  }
}

function checkUpdateData(req, res, next) {
  const {
    inv_make,
    inv_model,
    inv_description,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  let errors = [];

  if (
    !inv_make ||
    !inv_model ||
    !inv_description ||
    !inv_price ||
    !inv_year ||
    !inv_miles ||
    !inv_color ||
    !classification_id
  ) {
    errors.push("Please fill out all required fields.");
  }

  if (errors.length > 0) {
    res.render("inventory/editInventory", {
      title: "Edit Inventory Item",
      errors: errors,
      ...req.body,
    });
    return;
  }

  next();
}

/* ****************************************
 * Process Logout
 * ************************************ */
async function accountLogout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.log("Error destroying session", err);
      return res.redirect("/account");
    }
    console.log("Session destroyed successfully");
    res.clearCookie("sessionId");
    res.redirect("/account/login");
  });
}

/* ****************************************
 * update account view
 * ************************************ */

async function updateAccountView(req, res) {
  const { account_id } = req.params;
  const accountData = await accountModel.getAccountByID(account_id);
  let nav = await utilities.getNav();

  if (!accountData) {
    req.flash("message", "You need to log in first.");
    return res.redirect("/account/login");
  }

  res.render("account/update", {
    title: "Update Account",
    nav: nav,
    accountData: accountData,
  });
}

async function updateAccount(req, res) {
  const { firstName, lastName, email, account_id } = req.body;

  try {
    const existingEmail = await accountModel.getAccountByEmail(email);
    if (existingEmail && existingEmail.id !== account_id) {
      req.flash("errors", "Email already in use");
      return res.redirect("back");
    }

    await accountModel.updateAccountInfo(
      account_id,
      firstName,
      lastName,
      email
    );
    req.session.accountData.firstName = firstName;
    req.session.accountData.lastName = lastName;
    req.session.accountData.email = email;

    req.flash("message", "Account updated successfully");
    res.redirect("/account/manage");
  } catch (err) {
    console.error(err);
    req.flash("errors", "Failed to update account");
    res.redirect("back");
  }
}
async function changePassword(req, res) {
  const { password, account_id } = req.body;

  try {
    const hashedPassword = await utilities.hashPassword(password);

    await accountModel.updatePassword(account_id, hashedPassword);

    req.flash("message", "Password updated successfully");
    res.redirect("/account/manage");
  } catch (err) {
    console.error(err);
    req.flash("errors", "Failed to change password");
    res.redirect("back");
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  handleLogin,
  checkUpdateData,
  buildManagement,
  accountLogout,
  updateAccountView,
  updateAccount,
  changePassword,
};
