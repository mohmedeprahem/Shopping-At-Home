// module requirement
const express = require('express');
const routes = express.Router();

// controller files
const userController = require('../controllers/user');

// @dics: view cart page
// @routes: GET '/cart'
// @access: private
routes.get('/cart', userController.viewCartPage)

// @dics: add product to cart
// @routes: GET '/cart/add/:id'
// @access: private
routes.get('/cart/add/:id', userController.addCard);

// @dics: delete product from cart user
// @routes: GET '/cart/delete'
// @access: private
routes.get('/cart/delete/:productId', userController.deleteProductFromCart)

// @dics: buy all products in cart
// @routes: GET '/cart/buy'
// @access: private
routes.get('/cart/buy', userController.buyProductCart)
module.exports = routes;