const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const popper= require("popper.js");

let restaurants =[
    {name:"Hai Hai", image:"https://imagesvc.meredithcorp.io/v3/mm/image?url=https://static.onecms.io/wp-content/uploads/sites/9/2019/03/Hai-Hai-1-FT-BLOG0319.jpg"},
    {name:"Yumi",image:"https://stmedia.stimg.co/ctyp-YUMI-tonka+roll.JPG?w=1200&h=630"}
]
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');

app.get("/", function(req,res){
    res.redirect("/restaurants");
});

app.get("/restaurants", function(req,res){
    res.render("index",{restaurants: restaurants});
});

app.get("/restaurants/new", function(req,res){
res.render("new");
});

app.post("/restaurants",function(req,res){
    let name = req.body.name;
    let image= req.body.image;
    var newRest = {name:name, image:image}
    restaurants.push(newRest);
    res.redirect("/restaurants");
});

app.listen(3000, function(req,res){
    console.log("server started");
});

// app.listen(process.env.PORT, process.env.IP);
