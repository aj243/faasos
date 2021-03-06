var expressJwt = require('express-jwt');
var secret = sails.config.secret;
var jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {

    // If cookies are set in the browers or with the api request
    if (req.cookies.Jwt) {
        jwt.verify(req.cookies.Jwt, sails.config.secret, function (err, decoded) {
            if (err) {
                // return res.status(401).send({ success: false, message: err.message, name: err.name });
                return res.view('register');
            }
            if (decoded) {
                console.log(decoded[0]);
                next();
            }
        });
    } else {
        // return res.status(401).send({ success: false, message: 'token invalid' });
        return res.view('register');
    }
}