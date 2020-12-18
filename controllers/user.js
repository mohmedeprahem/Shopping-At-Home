// modules requirement
const ObjectId = require('mongodb').ObjectID;
const bcrypt = require('bcryptjs');


// database file
const mongoose = require('mongoose');
const productSchema = require('../models/product');
const userSchema = require('../models/user');

// @dics: get login page
// @routes: GET '/login'
// @access: public
exports.viewLoginPage = (req, res) => {
    res.status(202).render('login', {
        path: '/login',
        isLogin : false,
        errorMessege: req.flash('error'),
        csrfToken: req.csrfToken()
    });
}


// @dics: get sign up page
// @routes: GET '/sign-up'
// @access: public
exports.viewSignUpPage = (req, res) => {
    res.status(202).render('signup', {
        path: '/sign-up',
        errorMessege: req.flash('error'),
        isLogin : false,
        csrfToken: req.csrfToken()
    });
}

// @dics: add new user in database using sign page
// @routes: POST '/sign-up'
// @access: public
exports.addNewUser = async (req, res) => {
    try {
        // check if email is already used
        let result = await userSchema.User.findOne({email: req.body.email});
        let hashPassword = await bcrypt.hash(req.body.password, 12);
        
        // add new user
        if (!result) {
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
                console.log(err);
                res.status(200).redirect('/');
            });
            
        } else {
            // if email is already used
            req.flash('error', 'email is already used')
            return res.redirect('/sign-up');
        }

    } catch(err) {
        
    } 
}

// @dics: login the user
// @routes: POST '/login'
// @access: private
exports.login = async (req, res) => {
try{
        // check if email is true
        let user = await userSchema.User.findOne({email: req.body.email});
        

        if (user) {
            
            // check if password is true
            let result = await bcrypt.compare(req.body.password, user.password)
            if (result) {
                req.session.isLogin = true;
                req.session.userID = await user._id
                return req.session.save(err => {
                    console.log(err);
                    res.status(200).redirect('/');
                }); 
            } 
        }
            req.flash('error', 'email or password is false')
            return res.redirect('/login');
    } catch (error) {
        console.log(massege.err);
    } 
}

// @dics: logout
// @routes: GET '/logout'
// @access: private
exports.logout = (req, res) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
}

// @dics: add product to card
// @routes: GET '/cart/add/:id'
// @access: private
exports.addCard = async (req, res) => {
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
}

// @dics: view cart page
// @routes: GET '/cart'
// @access: private
exports.viewCartPage = async (req, res) => {
    let cartOfUser = await userSchema.User.findById(req.session.userID, {addCart: 1, _id: 0});
    console.log(cartOfUser)
    res.render('cart', {
        cartOfUser: cartOfUser.addCart,
        path: '/cart',
        csrfToken: req.csrfToken()
    })
}

// @dics: delete product from cart user
// @routes: GET '/cart/delete'
// @access: private
exports.deleteProductFromCart = async (req, res) => {
    // get cart of user to delete product
    let cartOfUser = await userSchema.User.findById(req.session.userID, { addCart: 1})
/*     .then((rel) => {
        console.log(rel);
        console.log(typeof req.params.productId)
        console.log(rel.addCart.productBuy.includes(req.params.productId)); // false
        console.log(rel.addCart.productBuy.indexOf({productId: req.params.productId})); //0;
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
}

// @dics: buy all products in cart
// @routes: GET '/cart/buy'
// @access: private
exports.buyProductCart = async (req, res) => {
    // add product to cart of user 
    let cartOfUser = await userSchema.User.findById( req.session.userID, {addCart: 1});

    cartOfUser.addCart.productBuy = [];
    // update total price
    cartOfUser.addCart.totalPrice = 0;
    await cartOfUser.save();
    res.redirect('/cart')
}