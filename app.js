require('dotenv').config()
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const md5 = require('md5');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect('mongodb://localhost:27017/userDB');
const userSchema = new mongoose.Schema({
  email:String,
  password:String
});

const User = mongoose.model('User',userSchema);


app.get("/",function(req,res){
  res.render("home");
});
app.get("/register",function(req,res){
  res.render("register");
});
app.get("/login",function(req,res){
  res.render("login");
});
app.post("/register",function(req,res){
  const newUser = new User({
    email:req.body.username,
    password:md5(req.body.password)
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets");
    }
  })
});
app.post("/login",function(req,res){
  const userEmail = req.body.username;
  const userPassword = md5(req.body.password)
  User.findOne({email:userEmail},function(err,user){
    if(err){
      console.log(err);
    }else{
      if(user){
        if(user.password === userPassword){
          res.render("secrets");
        }
      }
    }
  });
});

app.listen(3000,function(){
  console.log("Started at port 3000");
});
