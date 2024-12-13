const pool = require("../database/");

const ContactUs = {
  create: (name, email, message, callback) => {
    const query =
      "INSERT INTO contact_us (name, email, message) VALUES (?, ?, ?)";
    db.query(query, [name, email, message], (err, result) => {
      if (err) {
        return callback(err);
      }
      callback(null, result);
    });
  },

  getAllSubmissions: (callback) => {
    const query = "SELECT * FROM contact_us ORDER BY created_at DESC";
    db.query(query, (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  },
};

module.exports = ContactUs;
