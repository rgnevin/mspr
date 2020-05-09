const dotenv = require("dotenv").config;
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: 'AIzaSyCA_h1k8QRNXAy1voySGynbCvAna1fnbFk',
  formatter: null
};
 
var geocoder = NodeGeocoder(options);


// let restaurants =[
//     {name:"Hai Hai", image:"https://imagesvc.meredithcorp.io/v3/mm/image?url=https://static.onecms.io/wp-content/uploads/sites/9/2019/03/Hai-Hai-1-FT-BLOG0319.jpg"},
//     {name:"Yumi",image:"https://stmedia.stimg.co/ctyp-YUMI-tonka+roll.JPG?w=1200&h=630"}
// ]

mongoose.connect("mongodb://localhost:27017/mspr", {useNewUrlParser: true, useUnifiedTopology: true});

//SCHEMA SETUP
const restaurantSchema = new mongoose.Schema({
    name: String,
    image: String,
    deliv: Boolean,
    hours: String,
    location: String,
    lat: Number,
    lng: Number,
    delivMeth: String,
    deliRad : Number,
    description: String,
    phone: String,
    cuisine: String,
    neigh: String,
    siteLink: String,
    menu: String,
    dietFriendly: Boolean
});



const Restaurant = mongoose.model("Restaurant", restaurantSchema);
// Restaurant.create(
//     {name:"Hai Hai", image:"https://imagesvc.meredithcorp.io/v3/mm/image?url=https://static.onecms.io/wp-content/uploads/sites/9/2019/03/Hai-Hai-1-FT-BLOG0319.jpg"}
//     , function(err,restaurant){
//         if(err){
//             console.log("err");
//         }else{
//             console.log("newly created restaurant");
//             console.log(restaurant);
//         }
//     }
// );

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');

app.get("/", function(req,res){
    res.redirect("/restaurants");
});

app.get("/restaurants", function(req,res){
    neigh="any"
    cuisine="any"
    Restaurant.find({}, function(err,restaurants){
        if(err){
            console.log(err);
        } else{
            res.render("index",{restaurants: restaurants,neigh:neigh,cusine:cuisine});
        }
    });
});

app.get("/restaurants/new", function(req,res){

res.render("new");
});

app.post("/restaurants",function(req,res){
    let name = req.body.name;
    let image= req.body.image;
    let cuisine= req.body.cuisine;
    let deliv= req.body.deliv;
    let phone= req.body.phone;
    let menu= req.body.menu;
    let delivMeth= req.body.delivMeth;
    let neigh= req.body.neigh;
    let siteLink= req.body.siteLink;
    let hours =req.body.hours

    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
          console.log(err);
          req.flash('error', 'Invalid address');
          return res.redirect('back');
        }
        let lat = data[0].latitude;
        let lng = data[0].longitude;
        let location = data[0].formattedAddress;
        let newRest = {name:name, image:image,cuisine:cuisine,deliv:deliv,phone:phone,delivMeth:delivMeth,menu:menu,neigh:neigh,siteLink:siteLink, location:location, lat:lat,lng:lng, hours:hours }
        Restaurant.create(newRest, function(err,newlyCreated){
            if(err){
                console.log(err);
                res.redirect("/restaurants/new");
            }else{
                res.redirect("/restaurants");
            }
        });
    }); 
});

app.post("/restaurants/search", function(req,res){
    Restaurant.find({}, function(err,restaurants){
        if(err){
            console.log(err);
        } else{ 
            let cuisine = req.body.cuisine;
            let neigh = req.body.neigh;
            let deliv = req.body.deliv
            res.render("search",{restaurants:restaurants,cuisine1: cuisine,neigh1:neigh,deliv1:deliv});
        }
    });
});

//SHOW ROUTE
app.get("/restaurants/:id",function(req,res){
    //find restaurant with ID and render show template
    Restaurant.findById(req.params.id, function(err, foundRestaurant){
        if(err){
            console.log(err);
        }else{
            res.render("show2",{restaurant: foundRestaurant});
        }
    });
});

app.listen(3000, function(req,res){
    console.log("server started");
});

// app.listen(process.env.PORT, process.env.IP);
