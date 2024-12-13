const ContactUs = require("../models/contact-model");
const { validationResult } = require("express-validator");

const showContactPage = (req, res) => {
  res.render("contactUs");
};

const submitContactForm = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("contactUs", { errors: errors.array() });
  }

  const { name, email, message } = req.body;

  ContactUs.create(name, email, message, (err, result) => {
    if (err) {
      console.error("Error inserting contact form data:", err);
      return res
        .status(500)
        .send("Something went wrong, please try again later.");
    }

    res.redirect("/thank-you");
  });
};

module.exports = {
  showContactPage,
  submitContactForm,
};
