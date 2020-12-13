const express = require('express');
const routes = express.Router();
const userController = require('../controllers/user');

// @dics: get login page
// @routes: GET '/login'
// @access: public
routes.get('/login', userController.viewLoginPage);

// @dics: get sign up page
// @routes: GET '/sign-up'
// @access: public
routes.get('/sign-up', userController.viewSignUpPage);

// @dics: add new user
// @routes: POST '/sign-up'
// @access: private
routes.post('/sign-up', userController.addNewUser);

// @dics: login the user
// @routes: POST '/login'
// @access: private
routes.post('/login', userController.login);

// @dics: logout
// @routes: GET '/logout'
// @access: private
routes.get('/logout', userController.logout);

module.exports = routes;