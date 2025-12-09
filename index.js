require('dotenv').config();
var express = require ('express')
var ejs = require('ejs')
const path = require('path')
var mysql = require('mysql2');
var session = require ('express-session')
const expressSanitizer = require('express-sanitizer');
const { check, validationResult } = require('express-validator');

// Create the express application object
const app = express()
const port = 8000

// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs')

// Set up the body parser 
app.use(express.urlencoded({ extended: true }))

// Set up the express-sanitizer middleware
app.use(expressSanitizer());

// Set up public folder (for css and static js)
app.use(express.static(path.join(__dirname, 'public')))

// Define our application-specific data
app.locals.shopData = {shopName: "Health Tracker", ownerName: "Admin"};

// Define the database connection pool
const db = mysql.createPool({
    host: process.env.HEALTH_HOST,
    user: process.env.HEALTH_USER,
    password: process.env.HEALTH_PASSWORD,
    database: process.env.HEALTH_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
global.db = db;

app.use(session({
    secret: 'somerandomstuff',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}))
// Load the route handlers
const mainRoutes = require("./routes/main")
app.use('/', mainRoutes)

// Load the route handlers for /users
const usersRoutes = require('./routes/users')
app.use('/users', usersRoutes)

// Load the route handlers for /workouts
const workoutsRoutes = require('./routes/workouts')
app.use('/workouts', workoutsRoutes)

// Load the route handlers for /goals
const goalsRoutes = require('./routes/goals')
app.use('/goals', goalsRoutes)

const apiRoutes = require('./routes/api')
app.use('/api', apiRoutes)


// Start the web app listening
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// 404 Handler (Add this at the end of routes)
app.use((req, res, next) => {
    res.status(404).render('404.ejs', { user: req.session.userId });
});