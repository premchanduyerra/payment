const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
const mongoose = require('mongoose');


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));


const productIds = [];
const userIds=[];


mongoose.connect('mongodb+srv://admin123:admin123@cluster0-0tqob.mongodb.net/rent2trustDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
//product Schema..................................
const ProductDetailSchema = new mongoose.Schema({
    userId: String,
    productName: String,
    productId: String,
    Amount: Number
});
const Product = mongoose.model("product", ProductDetailSchema);
//address Schema ........................................
const addressSchema = new mongoose.Schema({
    userId:String,
    productId:String,
    firstName:String,
    lastName:String,
    middleName:String,
    company:String,
    email:String,
    phone:String,
    country:String,
    city:String,
    state:String,
    postalCode:String,
    address:String,

});
const Address = mongoose.model("address", addressSchema);

//saving product details to db
app.post("/productDetails", function (req, res) {
    let userId = req.body.userId;
    let productName = req.body.productName;
    let productId = req.body.productId;
    let Amount = req.body.Amount;
    console.log(Amount);
    userIds.push(userId);
    productIds.push(productId);
    const product = new Product({
        userId: userId,
        productName: productName,
        productId: productId,
        Amount: Amount
    });
    product.save();
    res.redirect("/address")
});

app.get("/address", function (req, res) {
    let u=userIds[0];
    Address.find({userId:u},function(err,addressData){
        if(err){
            console.log(err);
            
        }else{
            console.log(addressData);
            res.render("address", { productIds: productIds,userIds:userIds,addressData:addressData });
            userIds.pop();
            productIds.pop();
            
        }
    
});
   
});
//saving address details to db................................................
app.post("/addressDetails", function (req, res) {
    //console.log(req.body);
    
   const address= new Address({
    userId:req.body.userId,
    productId:req.body.productId,
    firstName:req.body.firstName,
    lastName:req.body.lastName,
    middleName:req.body.middleName,
    company:req.body.company,
    email:req.body.email,
    phone:req.body.phone,
    country:req.body.country,
    city:req.body.city,
    state:req.body.state,
    postalCode:req.body.postalCode,
    address:req.body.address,
   });
   address.save();
    res.redirect("/payment");
});
//...............payment...................

app.get("/payment", function (req, res) {
    res.send("payment page")
});



app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});


app.listen(process.env.PORT || 3000, function () {
    console.log("server is running at 3001 port");

});