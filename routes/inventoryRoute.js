const express = require("express"); // brings Express into the scope of the file.
const router = new express.Router(); // create a new Router object
const invController = require("../controllers/invController"); // week3 inventory controller
const utilities = require("../utilities");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// week3 accessing the specific vehicle detail based on its inventory_id
router.get("/detail/:inventory_id", invController.getVehicleDetail);

// W04 Assignment: Adding New Classifications and Vehicles
router.get("/", invController.buildManagementView);
router.get("/addClassification", invController.addClassificationForm);
router.post("/addClassification", invController.processAddClassification);
router.get("/addInventory", invController.addInventoryForm);
router.post("/addInventory", invController.processAddInventory);

// week 5 => edit/update/delete
router.get("/edit/:inv_id", invController.editInventoryView);
router.get("/delete/:inv_id", invController.deleteInventory);
router.get("/inv/:inventory_id", invController.getVehicleDetail);

/* ****************************************
* Get inventory for AJAX Route
Unit 5, Select inv item activity
* *************************************** */
router.get(
  "/getInventory/:classification_id",
  utilities.checkAccountType,
  utilities.handleErrors(invController.getInventoryJSON)
);

/* ****************************************
week 5 => Edit Inventory - inventory id
* *************************************** */
router.get(
  "/addInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

/* ****************************************
week 5 => Edit Inventory - inventory id
* *************************************** */
router.get(
  "/editInventory/:inventory_id",
  utilities.handleErrors(invController.editInventoryView)
);

router.post(
  "/update/",
  utilities.handleErrors(invController.updateInventory) // week 5
);

module.exports = router;
