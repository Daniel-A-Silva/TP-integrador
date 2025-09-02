function secured(req, res, next) {
    if (req.session && req.session.id_usuario) {
        next(); // sigue si está logueado
    } else {
        res.redirect('/admin/login');
    }
}


module.exports = secured;
    