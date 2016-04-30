'use strict';
const ENV = process.env.NODE_ENV;

module.exports = function(req, res, next) {

    res.sendHttpError = function(error) {

        res.status(error.status);
        if (req.xhr) {
            res.json(error.message);
        } else {
            res.render('error', {
                message: error.message,
                error: (ENV === 'development') ? error : {status: error.status, stack: ''}
            });
        }
    };

    next();

};