// module requirement
const express = require('express');
const routes = express.Router();

// controllers files
const productController = require('../controllers/product');

// @dics: view details about product
// @routes: post '/details/:productId'
// @access: public
routes.get('/details/:productId', productController.viewDetailsPage);

module.exports = routes;