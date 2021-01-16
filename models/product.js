const { text } = require('body-parser');
const mongoose = require('mongoose'); 

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'add the name'],
        minLength: [5, 'name at least 5 character'], 
        maxLength: [70, 'max 70 character']
    },
    img: {
        type: String,
        required: true
    },
    price: {
        type: String,
        requred: [true, 'add the price']
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});
const Product = mongoose.model('Product', productSchema);
module.exports.Product = Product