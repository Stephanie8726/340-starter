const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = '<ul class="nav-menu">';
  list +=
    '<li class="nav-item"><a href="/" title="Home page" class="nav-link">Home</a></li>';
  data.rows.forEach((row) => {
    list += '<li class="nav-item">';
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles" class="nav-link">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display" class="vehicle-grid">';
    data.forEach((vehicle) => {
      grid += '<li class="vehicle-item">';
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details" class="vehicle-link"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" class="vehicle-thumbnail" /></a>';
      grid += '<div class="name-price">';
      grid += "<hr />";
      grid += '<h2 class="vehicle-title">';
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details" class="vehicle-detail-link">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        '<span class="vehicle-price">$' +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* ****************************************
 * week3 => build the vehicle detail view HTML
 **************************************** */
Util.buildVehicleHTML = async function (vehicle) {
  console.log(vehicle);
  vehicle.inv_miles && !isNaN(vehicle.inv_miles)
    ? new Intl.NumberFormat("en-US").format(vehicle.inv_miles)
    : "Miles data unavailable";

  return `
    <div class="vehicle-detail">
        <img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${
    vehicle.inv_model
  }" class="vehicle-detail-image">
        <div class="vehicle-info-wrapper">
        <h2 class="vehicle-detail-title">
  <span class="vehicle-year-make-model">${vehicle.inv_year} ${
    vehicle.inv_make
  } ${vehicle.inv_model}</span>
  <span class="vehicle-detail-price">$${new Intl.NumberFormat("en-US").format(
    vehicle.inv_price
  )}</span>
</h2>
<p class="vehicle-detail-mileage">
  <span class="mileage-label">MILEAGE</span> <br>
  <span class="mileage-value">${new Intl.NumberFormat("en-US").format(
    vehicle.inv_miles
  )} miles</span>
</p>

        <p class="vehicle-detail-description">${vehicle.inv_description}</p>
        </div>
    </div>
  `;
};

// week4 => error handling middleware
function handleErrors(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}

// WEEK 4 => build classificationList
Util.buildClassificationList = async function (classification_id = undefined) {
  let data = await invModel.getClassifications();
  console.log(data.rows);
  let options = `<option value="" disabled selected>Select a Classification ▼ </option>`;
  data.rows.forEach((row) => {
    if (classification_id === row.classification_id) {
      options += `<option value="${row.classification_id}" selected>${row.classification_name}</option>`;
    }
    options += `<option value="${row.classification_id}">${row.classification_name}</option>`;
  });
  let select = `<select name="classification_id" id="classificationList">${options}</select>`;

  return select;
};

/* ****************************************
 * wek 5 => Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        console.log("=>>>>", JSON.stringify(res.locals));
        next();
      }
    );
  } else {
    next();
  }
};

/* ****************************************
 *  week =5> Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

/* ****************************************
 *  week5 assignment => check validity for account type
 * ************************************ */
Util.checkAccountType = (req, res, next) => {
  if (
    res.locals.accountData.account_type === "Employee" ||
    res.locals.accountData.account_type === "Admin"
  ) {
    next();
  } else {
    // res.locals.accountData = null;
    // res.locals.loggedin = 0;
    // res.clearCookie("jwt")

    req.flash("notice", "You do not have permission to access this page.");
    return res.redirect("/account/login");
  }
};

Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = {
  ...Util,
  handleErrors,
};
