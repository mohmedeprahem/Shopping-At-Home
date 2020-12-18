// module requirement
const express = require('express');
const routes = express.Router();
const isAuth = require('../middleware/is-auth');

// controller files
const userController = require('../controllers/user');

// @dics: view cart page
// @routes: GET '/cart'
// @access: private
routes.get('/cart', isAuth, userController.viewCartPage)

// @dics: add product to cart
// @routes: GET '/cart/add/:id'
// @access: private
routes.post('/cart/add/:id', isAuth, userController.addCard);

// @dics: delete product from cart user
// @routes: GET '/cart/delete'
// @access: private
routes.get('/cart/delete/:productId', isAuth, userController.deleteProductFromCart)

// @dics: buy all products in cart
// @routes: GET '/cart/buy'
// @access: private
routes.get('/cart/buy', isAuth, userController.buyProductCart)
module.exports = routes;