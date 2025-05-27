const usuarioModel = require('../models/usuarios');

async function autenticar(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ erro: 'Não autorizado. Faça login primeiro.' });
  }

  try {
    const usuario = await usuarioModel.buscarPorId(req.session.userId);
    if (!usuario) {
      return res.status(401).json({ erro: 'Usuário não encontrado.' });
    }

    req.usuario = usuario;
    next();
  } catch (erro) {
    console.error('Erro na autenticação:', erro);
    res.status(500).json({ erro: 'Erro interno na autenticação.' });
  }
}

module.exports = autenticar; 