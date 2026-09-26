// servicio-usuarios/src/controllers/authController.js
function registrarUsuario(req, res) {
  res.status(201).json({ mensaje: "Usuario registrado" });
}
module.exports = { registrarUsuario };

function loginUsuario(req, res) {
  res.status(200).json({ mensaje: "Inicio de sesión exitoso" });
}
module.exports.loginUsuario = loginUsuario;
