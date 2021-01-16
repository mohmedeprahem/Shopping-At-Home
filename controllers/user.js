// modules requirement
const ObjectId = require('mongodb').ObjectID;
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// config files
const mailer = require('../config/send-mail');

// database file
const mongoose = require('mongoose');
const productSchema = require('../models/product');
const userSchema = require('../models/user');

// @dics: get login page
// @routes: GET '/login'
// @access: public
exports.viewLoginPage = (req, res, next) => {
    try {
        res.status(202).render('login', {
            path: '/login',
            isLogin : false,
            errorMessege: req.flash('error'),
            csrfToken: req.csrfToken()
        });
    } catch (err) {
        next(err)
    }
}


// @dics: get sign up page
// @routes: GET '/sign-up'
// @access: public
exports.viewSignUpPage = (req, res, next) => {
    try {
        res.status(202).render('signup', {
            path: '/sign-up',
            errorMessege: req.flash('error'),
            isLogin : false,
            csrfToken: req.csrfToken()
        });
    } catch (err) {
        next(err)
    }
}

// @dics: add new user in database using sign page
// @routes: POST '/sign-up'
// @access: public
exports.addNewUser = async (req, res, next) => {
    try {
        let hashPassword = await bcrypt.hash(req.body.password, 12);
        
        // add new user
            let user = new userSchema.User({
                name: req.body.username,
                email: req.body.email,
                password: hashPassword
            });
            result = await user.save();
            
            // active session
            req.session.isLogin = true;
            req.session.userID = await result._id;
            req.session.save(err => {
                next(err);
                res.status(200).redirect('/');
            });

    } catch(err) {
        next(err)
    } 
}

// @dics: login the user
// @routes: POST '/login'
// @access: private
exports.login = async (req, res, next) => {
    try {
        // check if email is true
        let user = await userSchema.User.findOne({email: req.body.email});
        
        if (user) {
            
            // check if password is true
            let result = await bcrypt.compare(req.body.password, user.password)
            if (result) {
                req.session.isLogin = true;
                req.session.userID = await user._id
                return req.session.save(err => {
                    next(err);
                    res.status(200).redirect('/');
                }); 
            } 
        }
            req.flash('error', 'email or password is false')
            return res.redirect('/login');
    } catch (err) {
        next(err);
    } 
}

// @dics: logout
// @routes: GET '/logout'
// @access: private
exports.logout = (req, res, next) => {
    try {
        req.session.destroy(err => {
            next(err);
            res.redirect('/');
        });
    } catch (err) {
        next(err)
    }
}

// @dics: add product to card
// @routes: GET '/cart/add/:id'
// @access: private
exports.addCard = async (req, res, next) => {
    try {
        // get details of product
        let product = await productSchema.Product.findById(req.params.id);
        // add data of product to crat of user in database
        let user = await userSchema.User.findById(req.session.userID)
        // find if product is already added in user's cart
        let index = user.addCart.productBuy.findIndex(x => x.productId == req.params.id);
        // add product
        if(index !== -1){
            ++user.addCart.productBuy[index].cart;
        } else {
            const userCard = {
                cart: 1,
                price: product.price,
                img: product.img,
                productId: req.params.id
            }
            user.addCart.productBuy.push(userCard)
        }
        user.addCart.totalPrice += parseInt(product.price);
        await user.save(); 
        res.redirect('/')
    } catch (err) {
        next(err)
    }
    
}

// @dics: view cart page
// @routes: GET '/cart'
// @access: private
exports.viewCartPage = async (req, res, next) => {
    try {
        let cartOfUser = await userSchema.User.findById(req.session.userID, {addCart: 1, _id: 0});
        next(cartOfUser)
        res.render('cart', {
            cartOfUser: cartOfUser.addCart,
            path: '/cart',
            csrfToken: req.csrfToken()
        })
    } catch (err) {
        next(err)
    }    
}

// @dics: delete product from cart user
// @routes: GET '/cart/delete'
// @access: private
exports.deleteProductFromCart = async (req, res, next) => {
    try {
        // get cart of user to delete product
        let cartOfUser = await userSchema.User.findById(req.session.userID, { addCart: 1})
        /*     .then((rel) => {
            next(rel);
            next(typeof req.params.productId)
            next(rel.addCart.productBuy.includes(req.params.productId)); // false
            next(rel.addCart.productBuy.indexOf({productId: req.params.productId})); //0;
        }); */
    
        // find index of product in cart 
        let index = cartOfUser.addCart.productBuy.findIndex(product => product.productId == req.params.productId)
    
        // update total price
        let totalPriceBefore = cartOfUser.addCart.totalPrice
        cartOfUser.addCart.totalPrice = totalPriceBefore - ( cartOfUser.addCart.productBuy[index].price * cartOfUser.addCart.productBuy[index].cart);
    
        // delete product from cart of user
        cartOfUser.addCart.productBuy.pull({
            productId: ObjectId(req.params.productId)
        });
        
        await cartOfUser.save();
        res.redirect('/cart')
    } catch (err) {
        next(err);
    }
    
}

// @dics: buy all products in cart
// @routes: GET '/cart/buy'
// @access: private
exports.buyProductCart = async (req, res, next) => {
    try {
        // add product to cart of user 
        let cartOfUser = await userSchema.User.findById( req.session.userID, {addCart: 1});

        cartOfUser.addCart.productBuy = [];
        // update total price
        cartOfUser.addCart.totalPrice = 0;
        await cartOfUser.save();
        res.redirect('/cart');
    } catch (err) {
        next(err);
    }
    
}

// @dics: get reset password page
// @routes: GET '/reset-password'
// @access: private
exports.resetPasswordPage = (req, res, next) => {
    try {
        res.render('reset-password', {
            path:'/reset',
            csrfToken: req.csrfToken(),
            errorMessege: req.flash('error')
        });
    } catch (err) {
        next(err)
    }
   
}

// @dics: get reset password page
// @routes: GET '/reset-password'
// @access: private
exports.resetPasswordPage = (req, res, next) => {
    try {
        res.render('reset-password', {
            path:'/reset',
            csrfToken: req.csrfToken(),
            errorMessege: req.flash('error')
        });
    } catch (err) {
        next(err)
    }
   
}

// @dics: send to mail to user to change password
// @routes: POST '/reset-password'
// @access: private
exports.sendmail = async (req, res, next) => {
    try {
        const email = req.body.email;
        const user = await userSchema.User.findOne({email: email});
        if (!user){
            req.flash('error', 'email is not found');
            return res.redirect('/reset-password');
        } else {
            let buffer = crypto.randomBytes(32);
            const token = buffer.toString('hex');
            user.resetToken = token;
            user.resetTokenExpierd = Date.now() + 3600000;
            await user.save();
            let send = {
                from: 'm.eprahem.168@gmail.com',
                to: email,
                subject: 'reset password',
                html: `<p>click here: <a href="http://localhost:3000/reset-password/${token}">create new password</a></p>`
            };
            mailer.sendMail(send);
            req.flash('error', 'check your mail');
            res.redirect('/reset-password');
        }
    } catch (err) {
        next(err);
    }
    
}

// @dics: get new-password page
// @routes: GET '/reset-password/:token'
// @access: private
exports.getCreateNewPassword = async (req, res, next) => {
    try {
        const user = await userSchema.User.findOne({resetToken: req.params.token, resetTokenExpierd: {$gt: Date.now()}})
        if(!user){
            res.redirect('/login');
        } else {
            res.render('new-password', {
                token: user.resetToken,
                path:'/reset',
                csrfToken: req.csrfToken(),
            })
        }
    } catch (err) {
        next(err)
    }
    
}

// @dics: post new password
// @routes: POST '/reset-password/;token'
// @access: private

exports.changePassword = async (req, res, next) => {
    try {
        const user = await userSchema.User.findOne({resetToken: req.params.token, resetTokenExpierd: {$gt: Date.now()}})
        if(!user){
            res.redirect('/login');
        } else {
            let hashPassword  = await bcrypt.hash(req.body.newPassword, 12);
            user.password = hashPassword;
            user.resetToken = undefined;
            user.resetTokenExpierd = undefined;
            await user.save();
            res.redirect('/login');
        }
    } catch (err) {
        next(err);
    }
    
}