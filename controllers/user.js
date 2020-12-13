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
        
        let result = await userSchema.User.findOne({email: req.body.email});
        if(!result){
            let user = new userSchema.User({
                name: req.body.username,
                email: req.body.email,
                password: req.body.password
            });
            result = await user.save();
            req.session.isLogin = true;
            req.session.userID = await result._id;
            req.session.save(err => {
                console.log(err);
                res.status(200).redirect('/');
            });
            
        } else {
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
        let result = await userSchema.User.findOne({email: req.body.email});
        if(result){
            if(result.password === req.body.password){
                req.session.isLogin = true;
                req.session.userID = await result._id
                req.session.save(err => {
                    console.log(err);
                    res.status(200).redirect('/');
                });
            } else {
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
    if(!req.session.userID){
        return res.redirect('/login');
    }
    let product = await productSchema.Product.findById(req.params.id);
    let user = await userSchema.User.findById(req.session.userID)
    let index = user.addCart.productBuy.findIndex(x => x.productId == req.params.id);
    console.log(index)
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
    let cartOfUser = await userSchema.User.findById(req.session.userID, { addCart: 1})
/*     .then((rel) => {
        console.log(rel);
        console.log(typeof req.params.productId)
        console.log(rel.addCart.productBuy.includes(req.params.productId)); // false
        console.log(rel.addCart.productBuy.indexOf({productId: req.params.productId})); //0;
    }); */
    let index = cartOfUser.addCart.productBuy.findIndex(product => product.productId == req.params.productId)

    let totalPriceBefore = cartOfUser.addCart.totalPrice
    cartOfUser.addCart.totalPrice = totalPriceBefore - ( cartOfUser.addCart.productBuy[index].price * cartOfUser.addCart.productBuy[index].cart);

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
    let cartOfUser = await userSchema.User.findById( req.session.userID, {addCart: 1});

    cartOfUser.addCart.productBuy = [];

    cartOfUser.addCart.totalPrice = 0;
    await cartOfUser.save();
    res.redirect('/cart')
}