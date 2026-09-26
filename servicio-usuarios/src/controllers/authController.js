// servicio-usuarios/src/controllers/authController.js
function registrarUsuario(req, res) {
  res.status(201).json({ mensaje: "Usuario registrado" });
}
module.exports = { registrarUsuario };
