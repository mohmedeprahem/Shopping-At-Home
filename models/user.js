const mongoose = require('mongoose'); 

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'add the name'],
        minLength: [3, 'name at least 3 charcter'],
        maxlength: [50, 'please increase max character 50']
    },
    email: {
        type: String,
        unique: [true, 'email is already used'],
        required: [true, 'add the email']
    },
    password: {
        type: String,
        required: [true, 'add the password']
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