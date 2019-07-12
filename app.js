const express = require("express"),
      app = express(),
      bodyParser = require("body-parser"),
      request = require("request"),
      mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/shopacart", {useNewUrlParser: true});

app.use(express.static("public"));  //for css styling
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//schema setup for adding items
const shopacartSchema = new mongoose.Schema({
    name: String,
    category: String,
    price: Number,
    description: String,
    image: String
});

//schema setup for new signups
const userSignUpSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    username: String,
    password: String
});

let Shopacart = mongoose.model("Shopacart", shopacartSchema);

let userSignUp = mongoose.model("userSignUp", userSignUpSchema);

// add item to shopacart database
// Shopacart.create(
//     {
//         name: "Ninjago 7200 DPI Wireless Optical Mouse",
//         category: "Electronics",
//         price: 30,
//         description: "Next-gen 12,000 DPI HERO optical sensor delivers unrivaled gaming performance, accuracy and power efficiency Advanced LIGHTSPEED wireless gaming mouse for super-fast 1 ms response time and faster than wired performance Ultra-long battery life gives you up to 250 hours of continuous gaming on a single AA battery.",
//         image: "https://images-na.ssl-images-amazon.com/images/I/71weWdliAOL._SL1500_.jpg"
//     }, (err, item) => {
//         if(err) {
//             console.log("Error adding item to Shopacart database");
//             console.log(err);
//         } else {
//             console.log("New item added!");
//             console.log(item);
//         }
// });

//add new signup to userSignUp
// userSignUp.create(
//     {
//         username: "test1",
//         password: "password123"
//     }, (err, signup) => {
//         if(err) {
//             console.log("error adding new sign up to userSignUp database");
//             console.log(err);
//         } else {
//             console.log("New signup added!");
//             console.log(signup);
//         }
// });

app.get("/", (req, res) => {
    res.render("homepage");
});

app.get("/signup", (req, res) => {
    res.render("signuppage");
});

app.get("/login", (req, res) => {
    res.render("loginpage");
});

//index route
app.get("/items", (req, res) => {
    Shopacart.find({}, (err, allItems) => {
        if(err) {
            console.log("Error!");
            console.log(err);
        } else {
            res.render("items", {items : allItems});
        }
    });
});

//Create route where form is sending data to server
app.post("/items", (req, res) => {
    //grab each input from form
    let name = req.body.name;
    let category = req.body.category;
    let price = req.body.price;
    let description = req.body.description;
    let image = req.body.image;
	let newItem = {name: name, category: category, price: price, description: description, image: image};	//creating obj with these params
    //create item and save to database
    Shopacart.create(newItem, (err, newItem) => {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/items");
        }
    });
});

//login page 
app.post("/signup", (req, res) => {
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let username = req.body.username;
    let password = req.body.password;
    let newSignup = {firstname: firstname, lastname: lastname, username: username, password: password};
    userSignUp.create(newSignup, (err, newSignup) => {
        if(err) {
            console.log("Error on signup page");
            console.log(err);
        } else {
            res.redirect("/");
        }
    });
});

//New route where form is shown
app.get("/items/new", (req, res) => {
    res.render("new");
});

//Show route specific page info about each item
app.get("/items/:id", (req, res) => {
    res.send("Will serve as single product info page");
});

app.listen(3000, () => {
    console.log("Server listening on port 3000...");
});
