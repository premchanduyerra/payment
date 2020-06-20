const mongoose = require('mongoose');

const ProductDetailSchema = new mongoose.Schema({
    userId: String,
    productName: String,
    productId: String,
    Amount: Number
});
module.exports= mongoose.model("product", ProductDetailSchema);