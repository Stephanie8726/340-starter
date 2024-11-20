const express = require("express") // brings Express into the scope of the file.
const router = new express.Router() // create a new Router object
const invController = require("../controllers/invController") // inventory controller

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

module.exports = router;