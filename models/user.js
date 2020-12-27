const mongoose = require('mongoose'); 

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3,
        max: 20
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    addCart: {
       productBuy:[{
        _id : false,
        cart: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        img: {
            type: String,
            required: true
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        }
       }],
       totalPrice: {
           type: Number,
           default: 0,
           required: true
       }
    },
    resetToken: String,
    resetTokenExpierd: Date
});

module.exports.User = mongoose.model('User', userSchema);