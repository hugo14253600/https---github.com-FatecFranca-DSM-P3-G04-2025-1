const usuarioModel = require('../models/usuarios');
const bcrypt = require('bcrypt');

module.exports = {
  async listar(req, res) {
    try {
      const usuarios = await usuarioModel.listarUsuarios();
      res.json(usuarios);
    } catch (erro) {
      console.error('Erro ao listar usuários:', erro);
      res.status(500).json({ erro: 'Erro interno ao listar usuários.' });
    }
  },

  async registrar(req, res) {
    const { nome, nascimento, email, senha, senha2 } = req.body;

    if (senha !== senha2) {
      return res.status(400).json({ erro: 'As senhas não coincidem!' });
    }

    try {
      const usuarioExistente = await usuarioModel.buscarPorEmail(email);
      if (usuarioExistente) {
        return res.status(400).json({ erro: 'Este e-mail já está em uso!' });
      }

      const senhaHash = await bcrypt.hash(senha, 10);
      const usuario = await usuarioModel.criarUsuario({
        nome,
        nascimento: new Date(nascimento),
        email,
        senha: senhaHash,
      });

      // Remove a senha do objeto retornado
      const { senha: _, ...usuarioSemSenha } = usuario;
      res.status(201).json(usuarioSemSenha);
    } catch (erro) {
      console.error('Erro ao registrar usuário:', erro);
      res.status(500).json({ erro: 'Erro interno ao registrar usuário.' });
    }
  },

  async atualizar(req, res) {
    const { id } = req.params;
    const { nome, nascimento, email, senhaAtual, novaSenha } = req.body;

    try {
      const usuario = await usuarioModel.buscarPorId(id);
      if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não encontrado.' });
      }

      const dados = {
        nome: nome || usuario.nome,
        nascimento: nascimento ? new Date(nascimento) : usuario.nascimento,
        email: email || usuario.email
      };

      if (senhaAtual && novaSenha) {
        const senhaCorreta = await bcrypt.compare(senhaAtual, usuario.senha);
        if (!senhaCorreta) {
          return res.status(400).json({ erro: 'Senha atual incorreta.' });
        }
        dados.senha = await bcrypt.hash(novaSenha, 10);
      }

      const usuarioAtualizado = await usuarioModel.atualizarUsuario(id, dados);
      const { senha: _, ...usuarioSemSenha } = usuarioAtualizado;
      res.json(usuarioSemSenha);
    } catch (erro) {
      console.error('Erro ao atualizar usuário:', erro);
      res.status(500).json({ erro: 'Erro interno ao atualizar usuário.' });
    }
  },

  async deletar(req, res) {
    const { id } = req.params;

    try {
      await usuarioModel.deletarUsuario(id);
      res.status(204).send();
    } catch (erro) {
      console.error('Erro ao deletar usuário:', erro);
      res.status(500).json({ erro: 'Erro interno ao deletar usuário.' });
    }
  }
};
