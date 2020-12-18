const express = require('express');
const routes = express.Router();


// controllers files
const productController = require('../controllers/product');

// @dics: get home page
// @routes: GET '/'
// @access: public
routes.get('/', productController.viewHomePage);



module.exports = routes;