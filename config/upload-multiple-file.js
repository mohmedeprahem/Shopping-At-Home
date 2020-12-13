const path = require('path')
const multer = require('multer');

exports.img = {
    storage: multer.diskStorage({
            destination:  function (req, file, cb) {
                cb(null, './public/upload/img/')
            },
            filename: function (req, file, cb) {
                cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
            }
        }),
    filefilter: function(req, file, cb) {
        if(file.mimetype.includes('image')){
            return cb(null, true);
        } else {
            return cb('ERROR : Image Ony!');
        }
    }
}