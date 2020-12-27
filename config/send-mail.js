// module requirement
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport')

let options = {
    auth: {
        api_key: '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'
    },
};

module.exports = nodemailer.createTransport(sgTransport(options));