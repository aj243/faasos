/**
 * Product.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        id: {
            type: 'INTEGER',
            autoIncrement: true
        },
        name: {
            type: 'STRING',
            required: true,
            unique: true
        },
        quantity: {
            type: 'INTEGER',
            defaultsTo: 0,
            // required: true,
            // unique: true
        },
        createdTillNow: {
            type: 'INTEGER',
            defaultsTo: 0,
            // required: false
        },
        predicted: {
            type: 'INTEGER',
            defaultsTo: 0,
            // required: false
        }

    },


};

