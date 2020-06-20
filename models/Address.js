const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    userId: String,
    productId: String,
    firstName: String,
    lastName: String,
    middleName: String,
    company: String,
    email: String,
    phone: String,
    country: String,
    city: String,
    state: String,
    postalCode: String,
    address: String,

});
module.exports = mongoose.model("address", addressSchema);