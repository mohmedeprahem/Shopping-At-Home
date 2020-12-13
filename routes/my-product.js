// module requirement
const express = require('express');
const routes = express.Router();
const productController = require('../controllers/product');

// @dics: view my product page page
// @routes: GET '/my-product'
// @access: private
routes.get('/my-product', productController.viewMyProductPage)

// @dics: get idet page
// @routes: post '/my-product/edit'
// @access: private
routes.post('/my-product/edit', productController.editMyProductPage)

// @dics: edit my product
// @routes: post '/my-product/edit/done'
// @access: private
routes.post('/my-product/edit/done', productController.editMyProduct)

// @dics: delete my product
// @routes: post '/my-product/delete'
// @access: private
routes.post('/my-product/delete', productController.deleteMyProduct)

module.exports = routes;