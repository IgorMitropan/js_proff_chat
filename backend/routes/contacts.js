'use strict';
let User = require('../models/user').User;
let HttpError = require('../error').HttpError;

exports.get = function(req, res, next) {
    User.find(function(err, results) {
        if (err) {
            next(new HttpError(500, "Connection to database failed"));
        }
        let userNames = [];
        results.forEach(result => {
            userNames.push(result.get('username'));
        });

        res.json(userNames);
    });
};

