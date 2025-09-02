const pool = require('./bd'); // conexión a MySQL
const bcrypt = require('bcrypt');

async function getUserByUsername(username) {
    try {
        const query = "SELECT * FROM usuarios WHERE usuario = ?";
        const rows = await pool.query(query, [username]);
        return rows[0]; // devuelve el usuario (si existe)
    } catch (error) {
        throw error;
    }
}

// compara la contraseña ingresada con la guardada encriptada
async function validatePassword(passwordIngresada, passwordGuardada) {
    return bcrypt.compare(passwordIngresada, passwordGuardada);
}

module.exports = { getUserByUsername, validatePassword };
