const bcrypt = require('bcrypt');

(async () => {
  try {
    const password = "1234"; // la contraseña que querés encriptar
    const hash = await bcrypt.hash(password, 10); // 10 es el saltRounds
    console.log("Hash generado:", hash);
  } catch (error) {
    console.log(error);
  }
})();
