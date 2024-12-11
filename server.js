/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const session = require("express-session")
const pool = require("./database/")
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities/")
const generateErrorRoute = require("./routes/generateErrorRoute"); // week 3
const accountRoute = require('./routes/accountRoute'); //week 4
const bodyParser = require("body-parser") // week 4
const cookieParser = require("cookie-parser") // week 5

// const management = require('./views/management')

/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})


//week 4 => registration activity
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// week 5 login activity
app.use(cookieParser())

// week 5 login process activity
app.use(utilities.checkJWTToken)

/* ***********************
 * Routes
 *************************/
app.use(static)

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root
app.use("/account", accountRoute); // week 4


// app.use("/views", "./inventory/management") //week 5 => management.ejs 

/* ***********************
 * Generate error week 3
 *************************/
app.use('/generate-error', generateErrorRoute)


/* ***********************
*** Index router
* app.get => the expresses application will watch the "get" object, within the HTTP Request, for a particular route.
* "/" => This is route being watched.
* function(req, res){ => A JavaScript function that takes the request and response objects as parameters.
* res.render() => The "res" is the response object, while "render()" is an Express function that will retrieve the specified view - "index" - to be sent back to the browser.
* {title: "Home" } => The curly braces are an object (treated like a variable), which holds a name - value pair. This object supplies the value that the "head" partial file expects to receive. The object is passed to the view.
* }) => The right curly brace closes the function, while the right parentheses closes the "get" route.
 *************************/

// update index route (week 3)
app.get("/", baseController.buildHome)

// Inventory routes
app.use("/inv", utilities.checkLogin, utilities.checkAccountType, inventoryRoute)


// week 4 - account routes
app.use("/account", require("./routes/accountRoute"))

app.use('/account', utilities.handleErrors(accountRoute)) //week4 added


// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})


/* ***********************
* week4 Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message: err.message,
    nav
  })
})


/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
