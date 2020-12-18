// packages requirement
const flash = require('connect-flash');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path')
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf')

// connect session cookies to mongodb
let store = new MongoDBStore({
    uri: 'mongodb://localhost/shop',
    collection: 'mySessions'
});



// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// access to public folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// setup route middlewares of csrf token
const csrfProtection = csrf();

// connect to session
app.use(require('express-session')({
    secret: 'This is a secret',
    store: store,
    resave: false,
    saveUninitialized: false
}));

// add token to any page
app.use(csrfProtection);

// init connect-flash module
app.use(flash());

app.use((req, res, next) => {
    res.locals.isLogin = req.session.isLogin;
    next();
});



// routes files
const homeRoutes = require('./routes/home');
app.use(homeRoutes);
const authRoutes = require('./routes/auth');
app.use(authRoutes)
const addProductRoutes = require('./routes/addProduct');
app.use(addProductRoutes)
const cartRoutes = require('./routes/cart');
app.use(cartRoutes)
const detailsRoutes = require('./routes/details');
app.use(detailsRoutes)
const myProductRoutes = require('./routes/my-product');
app.use(myProductRoutes)






// connect to server and dataBase
mongoose.connect('mongodb://localhost/shop', { useNewUrlParser: true, useUnifiedTopology: true })
.then(result => {
    console.log('connect to mongodbs')
    app.listen(3000);
    console.log('connect to port 3000')
})
.catch(err => {
    console.log(err);
})