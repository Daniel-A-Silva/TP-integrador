var pool = require('./bd');

// Listar productos
async function getProductos() {
  var query = "select * from productos order by id desc";
  var rows = await pool.query(query);
  return rows;
}

// Insertar producto
async function insertProducto(obj) {
  try {
    var query = "insert into productos set ?";
    var rows = await pool.query(query, [obj]);
    return rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Eliminar producto
async function deleteProductoById(id) {
  var query = "delete from productos where id = ?";
  var rows = await pool.query(query, [id]);
  return rows;
}

// Traer un producto por id
async function getProductoById(id) {
  var query = "select * from productos where id = ?";
  var rows = await pool.query(query, [id]);
  return rows[0];
}

// Editar producto
async function updateProductoById(obj, id) {
  try {
    var query = "update productos set ? where id = ?";
    var rows = await pool.query(query, [obj, id]);
    return rows;
  } catch (error) {
    throw error;
  }
}

module.exports = { getProductos, insertProducto, deleteProductoById, getProductoById, updateProductoById }
