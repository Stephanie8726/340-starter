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
    console.log(vehicle)

    if (!vehicle) {
      return res.status(404).render("error", { message: "Vehicle not found" });
    }
    const vehicleHTML = await utilities.buildVehicleHTML(vehicle);
    let nav = await utilities.getNav();

    // render the view with the vehicle details
    res.render("inventory/vehicle-detail", {
      title: `${vehicle.make} ${vehicle.model}`,
      nav,
      vehicleHTML,
      vehicle,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = invCont;
