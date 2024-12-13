const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const contactUsController = require("../controllers/contactController");

router.get("/contact-us", contactUsController.showContactPage);

router.post(
  "/contact-us",
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("message").notEmpty().withMessage("Message cannot be empty"),
  contactUsController.submitContactForm
);

module.exports = router;
