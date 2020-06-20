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

mongoose.connect('mongodb+srv://admin123:admin123@cluster0-0tqob.mongodb.net/rent2trustDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

////......SCHEMASS.......................................
//product Schema.........................................
var Product=require("./models/Product.js");
//address Schema ........................................
var Address=require("./models/Address.js");
//.........delivery type schema..........................
var deliveryType=require("./models/deliveryType.js");

let productIds = "";
let userIds = "";


//saving product details to db
app.post("/productDetails", function (req, res) {
    let userId = req.body.userId;
    let productName = req.body.productName;
    let productId = req.body.productId;
    let Amount = req.body.Amount;
    console.log(Amount);
    userIds = userId;
    productIds = productId;
    const product = new Product({
        userId: userId,
        productName: productName,
        productId: productId,
        Amount: Amount
    });

    Product.find({userId: userId,productId: productId},function(err,data){
        if(err){
            console.log(err);
            
        }else{
            if(data.length === 0){
                console.log("nodata");
                product.save(function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.redirect("/address");
                    }
                });               
            }else{
                console.log(data);
                res.redirect("/address");
            }
        }
    });

});

app.get("/address", function (req, res) {
    if (userIds === "" || productIds === "") {
        res.redirect("/");
    }
    else
     {
        let u = userIds;
        Address.find({ userId: u }, function (err, addressData) {
            if (err) {
                console.log(err);

            } else {
                console.log(addressData);
                res.render("address", { productIds: productIds, userIds: userIds, addressData: addressData });
                //userIds.pop();
                // productIds.pop();
                console.log(userIds);
                console.log(productIds);
            }

        });
    }
});

//saving address details to db................................................
app.post("/addressDetails", function (req, res) {
    //console.log(req.body);
    let cmpy = req.body.company;
    const address = new Address({
        userId: req.body.userId,
        productId: req.body.productId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        middleName: req.body.middleName,
        company: cmpy,
        email: req.body.email,
        phone: req.body.phone,
        country: req.body.country,
        city: req.body.city,
        state: req.body.state,
        postalCode: req.body.postalCode,
        address: req.body.address,
    });

    Address.find({ userId: req.body.userId, productId: req.body.productId }, function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            if (data.length === 0) {
                console.log("no data");

                address.save(function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.redirect("/deliveryMethod");
                    }
                });
            }
            else {
                console.log("alredy stored");
                console.log(data);
                res.redirect("/deliveryMethod");
            }
        }
    });
});
//...............delivery type.......................................................

app.get("/deliveryMethod", function (req, res) {
    if (userIds === "" || productIds === "") {
        res.redirect("/");
    }
    else {
        res.render("deliveryMethod");
        //userIds.pop();
        // productIds.pop();
    }
});

app.post("/deliveryMethod", function (req, res) {
        let a;
        let type = req.body.radio;
        if (type === "freeDelivery") {
            a = 0;
        } else if (type === "standardDelivery") {
            a = 7;
        } else {
            a = 29;
        }
        const d = new deliveryType({
            userId: userIds,
            productId: productIds,
            type: type,
            amount: a
         });
        d.save(function (err) {
            if (err) {
             console.log(err);
            }
            else {
                res.redirect("/billing");
            }
        });
        console.log(req.body);
});

//....billing.................................................................
app.get("/billing", function (req, res) {

    if (userIds === "" || productIds === "") {
        res.redirect("/");
    }
    else {onsole.log(userIds);
        console.log(productIds);

        Product.find({ userId: userIds, productId: productIds }, function (err, productDetailsArr) {
            if (err) {
                console.log(err);

            } else {

                console.log("product details" + productDetailsArr);
                deliveryType.find({ userId: userIds, productId: productIds }, function (err, deliveryDetailsArr) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("this is det" + deliveryDetailsArr);
                        Address.find({ userId: userIds, productId: productIds }, function (err, addressDetailsArr) {
                            if (err) {
                                console.log(err);

                            } else {
                                console.log(addressDetailsArr);
                                res.render("billing", { addressDetailsArr: addressDetailsArr, productDetailsArr: productDetailsArr, deliveryDetailsArr: deliveryDetailsArr });
                            }
                        });
                    }
                });
            }
        });
    }
});
app.post("/billing", function (req, res) {

    res.redirect("/payment");
});

//................payment..............................................
app.get("/payment", function (req, res) {
    res.render("payment");
});

app.get("/cart", function (req, res) {
    res.render("cart");
});
app.get("/", function (req, res) {
   // res.render("cart");
   res.redirect("/cart");
   //res.sendFile(__dirname + "/cart.html");
});


app.listen(process.env.PORT || 3000, function () {
    console.log("server is running at 3001 port");

});