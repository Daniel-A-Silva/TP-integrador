const express = require('express');
const router = express.Router();
const usuariosModel = require('../../models/usuariosmodel');

// GET - login
router.get('/', (req, res) => {
    res.render('admin/login', { layout: 'admin/layout' });
});

// POST - procesar login
router.post('/', async (req, res) => {
    try {
        const { usuario, password } = req.body;
        const user = await usuariosModel.getUserByUsername(usuario);

        if (user) {
            const passwordOK = await usuariosModel.validatePassword(password, user.password);
            if (passwordOK) {
                req.session.id_usuario = user.id;
                req.session.nombre = user.usuario;
                return res.redirect('/admin/productos');
            }
        }
        res.render('admin/login', {
            layout: 'admin/layout',
            error: true,
            message: 'Usuario o contraseña incorrectos'
        });
    } catch (error) {
        console.log(error);
        res.render('admin/login', {
            layout: 'admin/layout',
            error: true,
            message: 'Error interno en el login'
        });
    }
});

// logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});

module.exports = router;
