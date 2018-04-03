var auth = require('../services/auth');

module.exports = {
    login: function (req, res) {
        auth.login(req, res);
    },
    validate_token: function (req, res) {
        auth.isvalidtoken(req, res);
    },
    logout: function (req, res) {
        //req.logout is passportjs function to clear user information. see http://passportjs.org/docs
        req.logout();
        req.session.destroy();
        res.clearCookie('Jwt', { path: '/' });
        res.redirect('/login');
    }
};


// watchProduct: function (req, res) {
//     if (!req.isSocket) {
//         return res.serverError("Not a socket request, seems like a Http request");
//     }

//     Product.find({}).exec(function (err, products) {
//         let productIds = _.pluck(products, 'id');
//         Product.subscribe(req, productIds);
//     });

//     return res.json({ message: "Subs Products" });
// },
