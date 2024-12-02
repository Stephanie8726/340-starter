const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* ***************************
 *  week3 fetch vehicle data and pass it to the view
 * ************************** */
invCont.getVehicleDetail = async function (req, res, next) {
  const { inventory_id } = req.params; // Get the inventory_id from the URL
  try {
    // Fetch the vehicle data using the model
    const vehicle = await invModel.getVehicleById(inventory_id);
    console.log(vehicle);

    if (!vehicle) {
      return res.status(404).render("error", { message: "Vehicle not found" });
    }
    const vehicleHTML = await utilities.buildVehicleHTML(vehicle);
    let nav = await utilities.getNav();

    console.log("=> ", JSON.stringify(vehicle))
    // render the view with the vehicle details
    res.render("inventory/vehicle-detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicleHTML,
      vehicle,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 * W04 Assignment: Adding New Classifications and Vehicles
 * Adding new classification
 * ************************** */
invCont.addClassificationForm = async function (req, res) {
  let nav = await utilities.getNav();
  res.render("inventory/addClassification", {
    title: "Add New Classification",
    nav,
    messages: req.flash("notice"),
  });
};

/* ***************************
 *  Processing new classification
 * ************************** */
invCont.processAddClassification = async function (req, res) {
  const { classificationName } = req.body;
  const isValid = /^[a-zA-Z0-9]+$/.test(classificationName);
  if (!isValid) {
    req.flash(
      "notice",
      "Classification name can only contain letters and numbers, no spaces or special characters."
    );
    return res.redirect("/inv/addClassification");
  }

  const result = await invModel.addClassification(classificationName);
  if (result) {
    req.flash("notice", "New classification added successfully!");
    res.redirect("/inv");
  } else {
    req.flash("notice", "Failed to add new classification.");
    res.redirect("/inv/addClassification");
  }
};

/* ***************************
 *  Adding new inventory
 * ************************** */
invCont.addInventoryForm = async function (req, res) {
  console.log("=> HELLO");

  let nav = await utilities.getNav();
  console.log("=> 1");

  let classificationList = await utilities.buildClassificationList();
  console.log("=> 2");

  res.render("inventory/addInventory", {
    title: "Add New Inventory Item",
    nav,
    classificationList,
    messages: req.flash("notice"),
    inv_make: "",
    inv_model: "",
    inv_description: "",
    inv_image: "",
    inv_thumbnail: "",
    inv_price: "",
    inv_year: "",
    inv_miles: "",
    inv_color: "",
    classification_id: "",
  });
};

/* ***************************
 *  Processing new inventory
 * ************************** */
invCont.processAddInventory = async function (req, res) {
  const {
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  if (
    !inv_make ||
    !inv_model ||
    !inv_description ||
    !inv_image ||
    !inv_thumbnail ||
    !inv_price ||
    !inv_year ||
    !inv_miles ||
    !inv_color ||
    !classification_id
  ) {
    req.flash("notice", "All fields are required.");
    return res.redirect("/inv/addinventory");
  }

  const result = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (result) {
    req.flash("notice", "New inventory item added successfully!");
    res.redirect("/inv/");
  } else {
    req.flash("notice", "Failed to add new inventory item.");
    res.redirect("/inv/addinventory");
  }
};

/* ***************************
 * inventory managment
 * ************************** */
invCont.management = async function (req, res) {
  let nav = await utilities.getNav();
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    messages: "",
  });
};

module.exports = invCont;
