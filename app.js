//require packages used in the project
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const usePassport = require('./config/passport')
const flash = require('connect-flash')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const routes = require('./routes')
require('./config/mongoose')

//start express and set the port
const app = express()
const port = process.env.PORT || 3000

//setting template engine
app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  //express-handlebars customs helper
  helpers: {
    //compare whether two values are equal or not.
    checkSelectedValue: function (value1, value2) {
      return value1 === value2
    }
  }
}))
app.set('view engine', 'hbs')

//setting resources path
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(flash())

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
usePassport(app)

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg ')
  next()
})

app.use(routes)//setting routes

//start and listen on the Express server
app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})