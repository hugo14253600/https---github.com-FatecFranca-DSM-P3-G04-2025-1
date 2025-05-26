const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const dicaController = {
  async listar(req, res) {
    try {
      const dicas = await prisma.dica.findMany();
      res.status(200).json(dicas);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar dicas.' });
    }
  },

  async criar(req, res) {
    const { titulo, conteudo } = req.body;
    try {
      const novaDica = await prisma.dica.create({
        data: { titulo, conteudo }
      });
      res.status(201).json(novaDica);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar dica.' });
    }
  }
};

module.exports = dicaController;
