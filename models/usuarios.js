const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  async criarUsuario(dados) {
    return await prisma.usuario.create({
      data: dados
    });
  },

  async buscarPorEmail(email) {
    return await prisma.usuario.findUnique({
      where: { email }
    });
  },

  async buscarPorId(id) {
    return await prisma.usuario.findUnique({
      where: { id }
    });
  },

  async listarUsuarios() {
    return await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        nascimento: true,
        criadoEm: true
      }
    });
  },

  async atualizarUsuario(id, dados) {
    return await prisma.usuario.update({
      where: { id },
      data: dados
    });
  },

  async deletarUsuario(id) {
    return await prisma.usuario.delete({
      where: { id }
    });
  }
};
