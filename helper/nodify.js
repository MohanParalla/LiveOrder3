var gcm = require('node-gcm');
var request = require('request');
const sendmail = require('sendmail')();
var moment = require('moment');
module.exports = {
    sendEMAILWithOtp: function(mail,token) 
    {
        var _time = moment().format('DD-MM-YYYY HH:mm:ss');
        var htmpage = ''
        sendmail({
            from: '<no-reply@test.com>',
            to: mail,
            subject: 'OTP to access account',
            html: htmpage,
          }, function(err, reply) {
              return 1
        });
    }
};