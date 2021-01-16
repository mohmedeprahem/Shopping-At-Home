// module requirement
const express = require('express');
const routes = express.Router();
const productController = require('../controllers/product');
const isAuth = require('../middleware/is-auth');

// @dics: view my product page page
// @routes: GET '/my-product'
// @access: private
routes.get('/my-product', isAuth, productController.viewMyProductPage)

// @dics: get idet page
// @routes: post '/my-product/edit'
// @access: private
routes.post('/my-product/edit', isAuth, productController.editMyProductPage)

// @dics: edit my product
// @routes: post '/my-product/edit/done'
// @access: private
routes.post('/my-product/edit/done/:productId', isAuth, productController.editMyProduct)

// @dics: delete my product
// @routes: post '/my-product/delete'
// @access: private
routes.post('/my-product/delete', isAuth, productController.deleteMyProduct)

module.exports = routes;