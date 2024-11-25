const express = require('express'); // assigned to a local variable
const router = express.Router(); // stored into a local variable for use => Router is a function
const invCont = require("../controllers/invController"); // week3

router.get("/inventory/:inventory_id", invCont.getVehicleDetail); // week3

// Static Routes
// Set up "public" folder / subfolders for static files
router.use(express.static("public")); // where static resources will be found
router.use("/css", express.static(__dirname + "public/css"));
router.use("/js", express.static(__dirname + "public/js"));
router.use("/images", express.static(__dirname + "public/images"));

// If a resource is NOT exported, it cannot be used somewhere else.
module.exports = router;



