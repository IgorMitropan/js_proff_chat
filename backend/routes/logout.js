'use strict';
exports.post = function(req, res, next) {
    let sid = req.session.id;
    let io = req.app.get('io');

    req.session.destroy(function(err) {
        io.sessionReload(io, sid);
        if (err) return next(err);

        res.redirect('/');
    });
};
