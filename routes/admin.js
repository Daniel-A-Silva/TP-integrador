var express = require('express');
var router = express.Router();
var secured = require('../middlewares/auth');
var productosRouter = require('./admin/productos');
var loginRouter = require('./admin/login');

// login sin secured
router.use('/login', loginRouter);

// productos con secured
router.use('/productos', secured, productosRouter);

module.exports = router;
