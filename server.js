require('dotenv').config()
const express = require('express')
const passport = require('passport')
const Strategy = require('passport-facebook').Strategy

var port = process.env.PORT || 3000;
passport.use(new Strategy({
    clientID: "512314004339653",
    clientSecret: "57ad39f377d321f332782c143b091993",
    callbaclURL: "http://localhost:"+port+"/auth/facebook/callback"
    },
    function (accessToken, refreshToken, profile, cb) {
        return cb(null, profile)
    })
)

passport.serializeUser(function (user, cb) {
    return cb(null, user)
})

passport.deserializeUser(function (user, cb) {
    return cb(null, user)
})

// create express app
var app = express()

// set view dir
app.set('views', __dirname + "/views")
app.set("view engine", "ejs")

app.use(require('morgan')('combined'))
app.use(require('cookie-parser')())
app.use(require('body-parser').urlencoded({ extended: true }))
app.use(require('express-session')({ secret: 'lco app', resave: true, saveUninitialized: true }))

//@route    -   GET  /
//@desc     -   a route to home page
//@access   -   PUBLIC
app.get('/', (req, res) => {
    res.render('home', { user: req.user })
})

//@route    -   GET  /login
//@desc     -   a route to home page
//@access   -   PUBLIC
app.get('/login', (req, res) => {
    res.render('login')
})

//@route    -   GET  /login/facebook
//@desc     -   a route to facebook auth
//@access   -   PUBLIC
app.get('/login/facebook', passport.authenticate('facebook'));

//@route    -   GET  /login/facebook/callback
//@desc     -   a route to facebook auth
//@access   -   PUBLIC
app.get('/login/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

//@route    -   GET  /profile
//@desc     -   a route to facebook auth
//@access   -   PRIVATE
app.get('/profile', require('connect-ensure-login').ensureLoggedIn(), 
    (req, res) => {
        req.render('profile', {user: req.user})
    })

app.listen(port)