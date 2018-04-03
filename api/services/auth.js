var passport = require('passport');
var jwt = require('jsonwebtoken');

module.exports = {
    login: function (req, res) {
        passport.authenticate('local', function (err, user) {
            if (!user) {
                res.status(400).send({
                    success: false,
                    message: 'invalidLogin'
                });
                return;
            } else {
                if (err) {
                    res.status(400).send({
                        success: false,
                        message: 'unknownError',
                        error: err
                    });
                } else {
                    //token expired in 1 day
                    var token = jwt.sign(user[0], sails.config.secret, { expiresIn: 60 * 60 * 24 });
                    var expiresIn = 60 * 60 * 2;
                    // Set persistent cookie
                    res.cookie('Jwt', token,{
                        maxAge: expiresIn,
                        path: '/'
                      });
                    return res.redirect('/')
                }
            }
        })(req, res);
    },
    isvalidtoken: function (req, res) {
        if (req.headers.authorization) {
            jwt.verify(req.headers.authorization.replace('Bearer ', ''), sails.config.secret, function (err, decoded) {
                if (err) return res.status(401).send({ success: false, message: 'invalid' });
                if (decoded) {
                    console.log(decoded[0]);
                    return res.send({ success: true, user: decoded });
                }
            });
        } else {
            return res.status(401).send({ success: false, message: 'token invalid' });
        }
    }
};
