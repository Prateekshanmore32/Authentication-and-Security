require('dotenv').config()
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
mongoose.connect('mongodb://localhost:27017/userDB');
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = mongoose.model('User', userSchema);


app.get("/", function(req, res) {
  res.render("home");
});
app.get("/register", function(req, res) {
  res.render("register");
});
app.get("/login", function(req, res) {
  res.render("login");
});
app.post("/register", function(req, res) {
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser = new User({
      email: req.body.username,
      password: hash
    });
    newUser.save(function(err) {
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }
    })
  });

});
app.post("/login", function(req, res) {
  const userEmail = req.body.username;
  const userPassword = req.body.password
  User.findOne({
    email: userEmail
  }, function(err, user) {
    if (err) {
      console.log(err);
    } else {
      if (user) {
        bcrypt.compare(userPassword, user.password, function(err, result) {
            if(result){
              res.render("secrets");
            }
        });
      }
    }
  });
});

app.listen(3000, function() {
  console.log("Started at port 3000");
});
