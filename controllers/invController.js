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
 * week3 fetch vehicle data and pass it to the view
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

    console.log("=> ", JSON.stringify(vehicle));
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
 * week 5 => update/edit Inventory
 * ************************** */
/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
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
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
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
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/editInventory", {
    title: "Edit " + itemName,
    nav,
    classificationList: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
    messages: req.flash()
    })
  }
}

/* ***************************
 *  week 4 and 5 => Build vehicle management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList();
    console.log(" =>", classificationSelect);
    res.render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      messages: "",
      errors: null,
      classificationSelect,
    });
  } catch (err) {
    next(err);
  }
};

/* **********************************************
 *  Return Inventory by Classification as JSON
    Unit 5, Select Inv Item activity
 * ********************************************* */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  console.log(" =>", classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id);
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ***************************
 *  week 5 => Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  console.log("=>>>>>", inv_id)
  let nav = await utilities.getNav();
  const itemData = await invModel.getVehicleById(inv_id);
  console.log("=>>>>>>", JSON.stringify(itemData))
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/editInventory", {
    title: "Edit " + itemName,
    nav,
    classificationList: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
    messages: req.flash()
  });
};


/* **********************************************
 * Week 5 => Delete vehicle 
 * ********************************************* */
invCont.deleteInventory = async function (req, res, next) {
  const { classification_id} = req.params; // Get the inventory ID from the URL
  
  // Delete vehicle using the model
  const result = await invModel.deleteInventory(classification_id);

  if (result) {
    req.flash("notice", "The vehicle was successfully deleted.");
    res.redirect("/inv");
  } else {
    req.flash("notice", "Failed to delete the vehicle.");
    res.status(500).render("error", { message: "There was an issue deleting the vehicle." });
  }
};

module.exports = invCont;
