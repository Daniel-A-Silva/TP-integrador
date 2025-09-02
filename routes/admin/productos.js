const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const productosModel = require('../../models/productosmodel');
const secured = require('../../middlewares/auth'); // tu middleware de sesión

// Configuración de multer para subir imágenes
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/imagenes'); // carpeta donde se guardan las imágenes
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // nombre único
  }
});
const upload = multer({ storage: storage });

// function secured(req, res, next) {
//     if (req.session && req.session.id_usuario) {
//         next(); // sigue si está logueado
//     } else {
//         res.redirect('/admin/login');
//     }
// }


// LISTAR PRODUCTOS
router.get('/', secured, async (req, res, next) => {
  try {
    const productos = await productosModel.getProductos();
    res.render('admin/productos', {
      layout: 'admin/layout',
      usuario: req.session.nombre,
      productos
    });
  } catch (error) {
    console.log(error);
    res.render('admin/productos', {
      layout: 'admin/layout',
      usuario: req.session.nombre,
      productos: [],
      error: true,
      message: 'Error al cargar productos'
    });
  }
});

// FORMULARIO AGREGAR PRODUCTO
router.get('/agregar', secured, (req, res) => {
  res.render('admin/agregar', {
    layout: 'admin/layout'
  });
});

// RUTA AGREGAR PRODUCTO
router.post('/agregar', secured, upload.single('imagen'), async (req, res, next) => {
  try {
    console.log('BODY:', req.body);  // 🔹 Debug
    console.log('FILE:', req.file);   // 🔹 Debug

    if (req.body.nombre && req.body.precio && req.body.descripcion && req.file) {
      let obj = {
        nombre: req.body.nombre,
        precio: req.body.precio,
        descripcion: req.body.descripcion,
        imagen: '/imagenes/' + req.file.filename,
        fecha_creacion: new Date() // ✅ fecha incluida
      };
      await productosModel.insertProducto(obj);
      res.redirect('/admin/productos');
    } else {
      res.render('admin/agregar', {
        layout: 'admin/layout',
        error: true,
        message: 'Todos los campos son requeridos, incluyendo la imagen'
      });
    }
  } catch (error) {
    console.error('Error al agregar producto:', error); // 🔥 muestra error real
    res.render('admin/agregar', {
      layout: 'admin/layout',
      error: true,
      message: 'No se cargó el producto'
    });
  }
});

// FORMULARIO EDITAR PRODUCTO
router.get('/editar/:id', secured, async (req, res) => {
  try {
    const producto = await productosModel.getProductoById(req.params.id);
    res.render('admin/editar', {
      layout: 'admin/layout',
      producto
    });
  } catch (error) {
    console.log(error);
    res.redirect('/admin/productos');
  }
});

// RUTA EDITAR PRODUCTO
router.post('/editar/:id', secured, upload.single('imagen'), async (req, res) => {
  try {
    let obj = {
      nombre: req.body.nombre,
      precio: req.body.precio,
      descripcion: req.body.descripcion
    };

    if (req.file) {
      obj.imagen = '/imagenes/' + req.file.filename;
    }

    await productosModel.updateProductoById(obj, req.params.id);
    res.redirect('/admin/productos');
  } catch (error) {
    console.log(error);
    res.render('admin/editar', {
      layout: 'admin/layout',
      producto: { id: req.params.id, ...req.body },
      error: true,
      message: 'No se modificó el producto'
    });
  }
});

// ELIMINAR PRODUCTO
router.get('/eliminar/:id', secured, async (req, res) => {
  try {
    await productosModel.deleteProductoById(req.params.id);
    res.redirect('/admin/productos');
  } catch (error) {
    console.log(error);
    res.redirect('/admin/productos');
  }
});

module.exports = router;
