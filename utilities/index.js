const invModel = require("../models/inventory-model");
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
  <span class="vehicle-year-make-model">${vehicle.inv_year} ${vehicle.inv_make} ${
    vehicle.inv_model
  }</span>
  <span class="vehicle-detail-price">$${new Intl.NumberFormat("en-US").format(
    vehicle.inv_price
  )}</span>
</h2>
<p class="vehicle-detail-mileage">
  <span class="mileage-label">MILEAGE</span> <br>
  <span class="mileage-value">${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)} miles</span>
</p>

        <p class="vehicle-detail-description">${
          vehicle.inv_description
        }</p>
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
Util.buildClassificationList = async function () {
  let data = await invModel.getClassifications();
  console.log(data.rows)
  let options = "";
  data.rows.forEach((row) => {
    options += `<option value="${row.classification_id}">${row.classification_name}</option>`;
  })
   let select = `<select name="classification_id">${options}</select>`
  return select;
};



module.exports = {
  ...Util, 
  handleErrors,
};
