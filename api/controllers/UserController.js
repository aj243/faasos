var auth = require('../services/auth');
var EmailAddresses = require('machinepack-emailaddresses');

module.exports = {
    register: function (req, res) {
        var email = req.param('email');
        var password = req.param('password');
        var username = req.param('username');

        //validate request
        if (_.isUndefined(req.param('email'))) {
            return res.badRequest('An email address is required!');
        }
        if (_.isUndefined(req.param('password'))) {
            return res.badRequest('A password is required');
        }
        if (req.param('password').length < 6) {
            return res.badRequest('A password must be at least 6 character')
        }
        EmailAddresses.validate({
            string: email
        }).exec({
            error: function (err) {
                return res.serverError(err);
            },
            invalid: function () {
                return res.badRequest('Does not looks like an email');
            },
            success: function () {
                User.findOne({ email: email }).exec(function (err, result) {
                    //validate from database
                    if (err) {
                        return res.serverError(err);
                    } else if (result) {
                        return res.badRequest('Email already used!');
                    } else {

                        User.create({ username: username, email: email, password: password }).exec(function (err, user) {
                            if (err) {
                                return res.serverError(err);
                            }
                            else {
                                // return res.ok(user);
                                auth.login(req, res);
                            }
                        })
                    }
                });
            }

        })

    }
};

