/**
 * ProductController
 *
 * @description :: Server-side logic for managing products
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    placeOrder: function (req, res) {
        var name = req.param('name');
        var quantity = parseInt(req.param('quantity'));

        //validate request
        if (_.isUndefined(req.param('name'))) {
            return res.badRequest('An product name is required!');
        }
        if (_.isUndefined(req.param('quantity'))) {
            return res.badRequest('A quantity is required');
        }
        else {
            Product.findOne({ name: name }).exec(function (err, product) {
                //validate from database
                if (err) {
                    return res.serverError(err);
                } else if (product) {

                    product.quantity += quantity;

                    let productId = product.id;
                    let productQty = product.quantity;

                    product.save(function (err, result) {
                        if (err) {
                            return res.serverError(err);
                        }
                        //Notify client socket about the update
                        Product.publishUpdate(productId, { productQty: productQty });
                        // return res.view('order');
                        return res.ok(product);
                    })
                }
            });
        }
    },

    setPredicted: function (req, res) {
        var name = req.param('name');
        var predicted = parseInt(req.param('predicted'));

        if (_.isUndefined(req.param('name'))) {
            return res.badRequest('An product name is required!');
        }
        if (_.isUndefined(req.param('predicted'))) {
            return res.badRequest('A predicted is required');
        }
        else {
            Product.findOne({ name: name }).exec(function (err, result) {
                //validate from database
                if (err) {
                    return res.serverError(err);
                } else if (result) {
                    return res.badRequest('Name already used!');
                } else {

                    Product.create({ name: name, predicted: predicted }).exec(function (err, result) {
                        if (err) {
                            return res.serverError(err);
                        }
                        return res.ok(result);
                        // return res.view('predicted');
                    })
                }
            });
        }

    },

    orderCompleted: function (req, res) {
        var name = req.param('name');

        if (name) {
            Product.findOne({ name: name }).exec(function (err, product) {
                if (err) {
                    return res.serverError(err);
                } else if (product) {
                    product.createdTillNow = product.quantity;
                    product.quantity = 0;

                    product.save(function (err, result) {
                        if (err) {
                            return res.serverError(err);
                        }
                        return res.ok(product);
                    })
                }
            });
        }
    },

    index: function (req, res) {
        Product.find(function (err, products) {
            if (err) {
                return res.serverError(err);
            } else if (products) {
                console.log(products);

                return res.view('index', {
                    products: products
                });

            }
        });

    },

    change: function (req, res) {
        if (!req.isSocket) {
            return res.badRequest('Only a client socket can subscribe. It appears to be an HTTP request.');
        }
        let value = req.body.value;
        var ref = req.body.ref;
        //Add the socket to room
        Product.findOne({ id: value }).exec(function (err, product) {
            //validate from database
            var createdTillNow;
            if (err) {
                return res.serverError(err);
            } else if (product) {
                product.createdTillNow += product.quantity;
                product.quantity = 0;
                createdTillNow = product.createdTillNow;
                product.save(function (err) {
                    if (err) {
                        return res.serverError(err);
                    }
                    sails.sockets.blast('message', { createdTillNow: createdTillNow, ref: ref });

                    return res.json({ createdTillNow: createdTillNow });
                })
            }
        });
    },

    watchProduct: function (req, res) {
        if (!req.isSocket) {
            return res.serverError("Not a socket request, seems like a Http request");
        }

        Product.find({}).exec(function (err, products) {
            let productIds = _.pluck(products, 'id');
            Product.subscribe(req, productIds);
        });

        return res.json({ message: "Subs Products" });
    },

    createPdf: function (req, res) {
        Product.find(function (err, products) {
            //validate from database
            if (err) {
                return res.serverError(err);
            } else if (products) {
                sails.hooks.pdf.make("testPdf",
                    {
                        products: products,
                    },
                    {
                        output: 'pdf/report.pdf'
                    }).then(function (result) {
                        res.download(result.filename, 'report.pdf', function (err) {
                            if (err) {
                                console.log('something went wrong with pdf download');
                            }
                        });
                        console.log(result);
                    }).catch(function (error) {
                        console.log(error);
                    });
            }
        });
    }

};

