const path = require('path');
const express = require('express');
const routes = express.Router();
const userController = require('../controllers/user');
const productController = require('../controllers/product');

// @dics: get add product page
// @routes: GET '/add-product'
// @access: private
routes.get('/add-product', productController.viewAddProductPage)

// @dics: add new product
// @routes: POST '/add-product'
// @access: private
routes.post('/add-product', productController.addProduct)

module.exports = routes;