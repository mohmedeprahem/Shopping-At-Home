// database file
const mongoose = require('mongoose');
const productSchema = require('../models/product');
const userSchema = require('../models/user');
const ObjectId = require('mongodb').ObjectID;
// @dics: get login page
// @routes: GET '/login'
// @access: public
exports.viewLoginPage = (req, res) => {
    res.status(202).render('login', {
        path: '/login',
        found: true,
        isLogin : false
    });
}


// @dics: get sign up page
// @routes: GET '/sign-up'
// @access: public
exports.viewSignUpPage = (req, res) => {
    res.status(202).render('signup', {
        path: '/sign-up',
        isSuccessful : false,
        isLogin : false
    });
}

// @dics: add new user in database using sign page
// @routes: POST '/sign-up'
// @access: public
exports.addNewUser = async (req, res) => {
    try {
        // check if email is already used
        let result = await userSchema.User.findOne({email: req.body.email});

        // add new user
        if(!result){
            let user = new userSchema.User({
                name: req.body.username,
                email: req.body.email,
                password: req.body.password
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
            return res.status(400).render('signup', {
                path: '/sign-up',
                isSuccessful : true,
                isLogin : false,
            })
        }

    }
    catch(err){
        
    } 
}

// @dics: login the user
// @routes: POST '/login'
// @access: private
exports.login = async (req, res) => {
    try {
        // check if email is true
        let result = await userSchema.User.findOne({email: req.body.email});

        // if email is true
        if(result){
            // check if password is true
            if(result.password === req.body.password){
                req.session.isLogin = true;
                req.session.userID = await result._id
                req.session.save(err => {
                    console.log(err);
                    res.status(200).redirect('/');
                });
            } else {
                // if email or password is false
                return res.status(400).render('login', {
                    path: '/login',
                    found: false,
                    isLogin : false 
                })
            }
        }
    } catch(err) {
            console.log(err.massage)
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
    // check if user doesn't login then return him to login page becouse user can't add new product if he logout
    if(!req.session.userID){
        return res.redirect('/login');
    }
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
        isLogin : req.session.isLogin
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
    
    let result = await cartOfUser.save();
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