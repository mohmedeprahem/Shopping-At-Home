// packages requirement
const express = require('express');
const mongoose = require('mongoose');
const path = require('path')
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const multer = require('multer');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// connect session cookies to mongodb
let store = new MongoDBStore({
    uri: 'mongodb://localhost/shop',
    collection: 'mySessions'
});



// connect to session
app.use(require('express-session')({
    secret: 'This is a secret',
    store: store,
    resave: false,
    saveUninitialized: false
}));

// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// access to public folder
app.use(express.static(path.join(__dirname, 'public')));

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