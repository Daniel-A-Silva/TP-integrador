const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.get('/', (req, res) => {
  res.render('contactanos');
});

router.post('/', async (req, res) => {
  const { nombre, apellido, email, telefono, mensaje } = req.body;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const mailOptions = {
    from: email,
    to: "tu_correo@mailtrap.io", // tu inbox de Mailtrap
    subject: `Nuevo mensaje de ${nombre} ${apellido}`,
    text: `Teléfono: ${telefono}\n\nMensaje:\n${mensaje}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.render('contactanos', {
      success: true,
      mensaje: "✅ Tu mensaje ha sido enviado exitosamente.<br>¡Gracias por confiar en Franchu Creations!"
    });
  } catch (error) {
    console.log(error);
    res.render('contactanos', {
      error: true,
      mensaje: "❌ Ocurrió un error al enviar el mensaje. Intenta nuevamente."
    });
  }
});
module.exports = router;
