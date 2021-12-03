require('dotenv').config()
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: process.env.SECRET,

  resave: false,

  saveUninitialized: false,

  cookie: {}
}))
app.use(passport.initialize()); 
app.use(passport.session());

mongoose.connect('mongodb://localhost:27017/userDB');
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.get("/", function(req, res) {
  res.render("home");
});
app.get("/register", function(req, res) {
  res.render("register");
});
app.get("/login", function(req, res) {
  res.render("login");
});
app.get("/secrets", function(req, res) {
  if (req.isAuthenticated()) {
    res.render("secrets");
  } else {
    res.redirect("/login")
  }
})
app.get("/logout",function(req,res){
  req.logout()
  res.redirect("/")
})
app.post("/register", function(req, res) {
  User.register({
    username: req.body.username
  }, req.body.password, function(err, result) {
    if (err) {
      console.log(err);
      res.redirect("/register")
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/secrets")
      })
    }
  })
});
app.post("/login", function(req, res) {
  const user = new User({
    email : req.body.username,
    password : req.body.password
  })
  req.login(user,function(err){
    if(err){
      console.log(err);
    }else{
      passport.authenticate("local")(req, res, function() {
        res.redirect("/secrets")
      })
    }
  })
});

app.listen(3000, function() {
  console.log("Started at port 3000");
});
