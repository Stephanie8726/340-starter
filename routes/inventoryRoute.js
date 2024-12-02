const express = require("express") // brings Express into the scope of the file.
const router = new express.Router() // create a new Router object
const invController = require("../controllers/invController") // week3 inventory controller


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// week3 accessing the specific vehicle detail based on its inventory_id
router.get('/detail/:inventory_id', invController.getVehicleDetail);

// W04 Assignment: Adding New Classifications and Vehicles
router.get("/", invController.management);
router.get("/addClassification", invController.addClassificationForm);
router.post("/addClassification", invController.processAddClassification);
router.get("/addInventory", invController.addInventoryForm);
router.post("/addInventory", invController.processAddInventory);

module.exports = router;