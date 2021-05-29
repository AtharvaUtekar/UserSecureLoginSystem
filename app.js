
// For crucial info encryption on github
require('dotenv').config()

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Making connection
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser: true, useUnifiedTopology: true });

// Making Schema
// Updating Schema for mongoose encryption
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// Adding Schema as js model

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password']});



// Making Model
const User = new mongoose.model("User", userSchema);


app.get("/", function(req, res){
  res.render("home.ejs");
});

app.get("/login", function(req, res){
    res.render("login.ejs");
});

app.get("/register", function(req, res){
    res.render("register.ejs");
});

// Making db of user passed data, here user input at register route
// Get the name given to input in .ejs file
app.post("/register", function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })

    newUser.save(function(err){
        if(err){    
            console.log(err);   }
        else {  
            res.render("secrets.ejs");   
        }
    });
});

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username}, function(err, foundUser){
        if(err){
            console.log(err);
        }
        else{
            if(foundUser){
                if(foundUser.password === password){
                    res.render("secrets.ejs");  
                }
            }
        }

    });

});


app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
