const utilities = require("../utilities/") // imports an index.js file  from a utilities folder. 
const baseController = {} //  creates an empty object named baseController.

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav() //  creates an empty object named baseController under utilities > index.js
  res.render("index", {title: "Home", nav}) // send the index view back to the client, using the response object. 
}

module.exports = baseController