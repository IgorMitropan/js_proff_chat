'use strict';
const express = require('express');
const router = express.Router();

let checkAuth = require('../middleware/checkAuth');

router.get('/', function (req, res) {
    res.render('index', {});
    });

/*GET contacts */
router.get('/contacts', require('./contacts').get);

/* GET comments */
router.get('/messages', require('./messages').get);

/* authorization */
router.post('/login', require('./login').post);

router.post('/logout', checkAuth, require('./logout').post);

module.exports = router;

