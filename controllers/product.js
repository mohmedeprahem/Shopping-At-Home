// database file
const productSchema = require('../models/product');
const userSchema = require('../models/user');
const ObjectId = require('mongodb').ObjectID;
 

// loading modules
const multer = require('multer');
const fs = require('fs');
const path = require('path')
//config files
const imgInfo = require('../config/upload-multiple-file')

// @dics: get home page
// @routes: GET '/'
// @access: public
exports.viewHomePage = async (req, res, next) => {
    try {
        const products = await productSchema.Product.find();
        res.render('home', {
            path: '/home',
            products: products,
            csrfToken: req.csrfToken()
        });
    } catch (err) {
        next(err)
    }
}

// @dics: get add product page
// @routes: GET '/add-product'
// @access: private
exports.viewAddProductPage = (req, res, next) => {
    try {
        res.render('addProduct', {
            path: '/add-product',
            csrfToken: req.csrfToken()
        })
    } catch (err) {
        next(err)
    }
}


// @dics: add new product
// @routes: POST '/add-product'
// @access: private
exports.addProduct = async (req, res, next) => {
    try {
        const upload = multer({
            storage : imgInfo.img.storage,
            fileFilter: imgInfo.img.filefilter
        }).single('image')
        upload(req, res, async (err) => {
            // if user send bad file extantion or didnt send img
            if (err) {
                next(err);
                res.render('addProduct', {
                    path: '/add-product',
                    msg: err,
                    csrfToken: req.csrfToken()
                })
            } else {
                const product = new productSchema.Product({
                    name: req.body.productName,
                    img: path.join('../upload/img/' + req.file.filename),
                    price: req.body.price,
                    owner: req.session.userID
                });
                await product.save();
    
                res.redirect('/my-product');
            }
        })
    } catch (err) {
        next(err)
    }
    
}

// @dics: get my product page
// @routes: GET '/my-product'
// @access: private
exports.viewMyProductPage = async (req, res, next) => {
    try {
        let myProduct = await productSchema.Product.find({owner: req.session.userID}).select({__v: 0});
        res.render('my-product', {
            path: '/my-product',
            myProduct: myProduct,
            csrfToken: req.csrfToken()
        })
    } catch (err) {
        next(err)
    }
};

// @dics: get edit-product page
// @routes: post '/my-product/edit'
// @access: private
exports.editMyProductPage = async (req, res, next) => {
    try {
        let myProduct = await productSchema.Product.findById(req.body.productId).select({ __v: 0 });
        res.render('edit-product', {
            path: '/edit-product',
            edit: true,
            product: myProduct,
            csrfToken: req.csrfToken()
        });
    } catch (err) {
        next(err);
    }
};

// @dics: edit my product
// @routes: post '/my-product/edit'
// @access: private
exports.editMyProduct = async (req, res, next) => {
    try {
        console.log(req.body)       
        let product = await productSchema.Product.findById(req.params.productId);
        product.name = req.body.productName;
        product.price = req.body.price;
    
        const upload = multer({
            storage : imgInfo.img.storage,
            fileFilter: imgInfo.img.filefilter
        }).single('newImage')
        upload(req, res, async (err) => {
            if (err) {
                await product.save();
                res.redirect('/my-product');
            } else{
                let paths = path.join(__dirname,'../public/upload/', req.body.oldImage);
                fs.unlink(paths, (err) => {
                    if (err) {
                      console.error(err)
                      return
                    }
                    //file removed
                })
                product.img =  path.join('../upload/img/' + req.file.filename);
                await product.save();
                res.redirect('/my-product');
            }
        })
    } catch (err) {
        next(err);
    }
    
};

// @dics: delete my product
// @routes: post '/my-product/delete'
// @access: private
exports.deleteMyProduct = async (req, res) => {
    try {
        let result = await productSchema.Product.findByIdAndDelete(req.body.productId);
        let paths = path.join(__dirname,'../public/upload/', result.img);
        fs.unlink(paths, (err) => {
            if (err) {
              console.error(err);
              return;
            }
          
            //file removed
          })
        res.redirect('/my-product');
    } catch (err) {
        next(err);
    }
    
}

// @dics: view details about product
// @routes: get '/details/:productId'
// @access: public
exports.viewDetailsPage = async (req, res, next) => {
    try {
        let product = await productSchema.Product.findById(req.params.productId).select({ __v: 0 });
        res.render('details', {
            path: '/home',
            product: product,
            csrfToken: req.csrfToken()
        });
    } catch (err) {
        next(err)
    }
}