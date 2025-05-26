const usuarioModel = require('../models/usuarios');
const bcrypt = require('bcrypt');

module.exports = {
  async login(req, res) {
    const { email, senha } = req.body;

    try {
      const usuario = await usuarioModel.buscarPorEmail(email);
      if (!usuario) {
        return res.status(401).json({ erro: 'Usuário não encontrado!' });
      }

      const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
      if (!senhaCorreta) {
        return res.status(401).json({ erro: 'Senha incorreta!' });
      }

      // Configura a sessão do usuário
      req.session.userId = usuario.id;
      
      // Remove a senha do objeto retornado
      const { senha: _, ...usuarioSemSenha } = usuario;
      res.json({ 
        mensagem: 'Login realizado com sucesso!',
        usuario: usuarioSemSenha
      });
    } catch (erro) {
      console.error('Erro no login:', erro);
      res.status(500).json({ erro: 'Erro interno no login.' });
    }
  },

  async logout(req, res) {
    req.session.destroy((erro) => {
      if (erro) {
        return res.status(500).json({ erro: 'Erro ao fazer logout.' });
      }
      res.json({ mensagem: 'Logout realizado com sucesso!' });
    });
  },

  async verificarAutenticacao(req, res) {
    if (req.session.userId) {
      try {
        const usuario = await usuarioModel.buscarPorId(req.session.userId);
        if (usuario) {
          const { senha: _, ...usuarioSemSenha } = usuario;
          return res.json({ autenticado: true, usuario: usuarioSemSenha });
        }
      } catch (erro) {
        console.error('Erro ao verificar autenticação:', erro);
      }
    }
    res.json({ autenticado: false });
  }
};
