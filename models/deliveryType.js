
const mongoose = require('mongoose');
const deliveryTypeSchema = new mongoose.Schema({
    userId: String,

    productId: String,
    type: String,
    amount: Number
});
module.exports = mongoose.model("deliveryType", deliveryTypeSchema);