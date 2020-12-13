const { text } = require('body-parser');
const mongoose = require('mongoose'); 

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        max: 100
    },
    img: {
        type: String,
        required: true
    },
    price: {
        type: String,
        requred: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});
const Product = mongoose.model('Product', productSchema);
module.exports.Product = Product