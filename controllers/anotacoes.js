const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads';
    // Cria o diretório se não existir
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Gera um nome único para o arquivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // limite de 5MB
  },
  fileFilter: function (req, file, cb) {
    // Aceita apenas imagens
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Apenas imagens são permitidas!'));
    }
    cb(null, true);
  }
}).single('imagem');

const anotacoesController = {
  async listar(req, res) {
    try {
      const anotacoes = await prisma.anotacao.findMany({
        where: {
          usuarioId: req.usuario.id
        },
        orderBy: {
          criadoEm: 'desc'
        }
      });
      res.json(anotacoes);
    } catch (erro) {
      console.error('Erro ao listar anotações:', erro);
      res.status(500).json({ erro: 'Erro ao listar anotações.' });
    }
  },

  async criar(req, res) {
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ erro: 'Erro no upload do arquivo: ' + err.message });
      } else if (err) {
        return res.status(400).json({ erro: err.message });
      }

      const { titulo, conteudo } = req.body;
      let midia = null;
      
      // Se houver arquivo enviado, salva o caminho
      if (req.file) {
        midia = req.file.filename;
      }

      try {
        const anotacao = await prisma.anotacao.create({
          data: {
            titulo,
            conteudo,
            midia,
            grupo: req.body.grupo,
            tipo: req.file ? 'imagem' : 'texto',
            usuario: {
              connect: { id: req.usuario.id }
            }
          }
        });
        res.status(201).json(anotacao);
      } catch (erro) {
        console.error('Erro ao criar anotação:', erro);
        res.status(500).json({ erro: 'Erro ao criar anotação.' });
      }
    });
  },

  async atualizar(req, res) {
    const { id } = req.params;
    const { titulo, conteudo } = req.body;

    try {
      const anotacao = await prisma.anotacao.findUnique({
        where: { id }
      });

      if (!anotacao) {
        return res.status(404).json({ erro: 'Anotação não encontrada.' });
      }

      if (anotacao.usuarioId !== req.usuario.id) {
        return res.status(403).json({ erro: 'Sem permissão para editar esta anotação.' });
      }

      const anotacaoAtualizada = await prisma.anotacao.update({
        where: { id },
        data: {
          titulo,
          conteudo
        }
      });

      res.json(anotacaoAtualizada);
    } catch (erro) {
      console.error('Erro ao atualizar anotação:', erro);
      res.status(500).json({ erro: 'Erro ao atualizar anotação.' });
    }
  },

  async deletar(req, res) {
    const { id } = req.params;

    try {
      const anotacao = await prisma.anotacao.findUnique({
        where: { id }
      });

      if (!anotacao) {
        return res.status(404).json({ erro: 'Anotação não encontrada.' });
      }

      if (anotacao.usuarioId !== req.usuario.id) {
        return res.status(403).json({ erro: 'Sem permissão para deletar esta anotação.' });
      }

      // Se houver uma imagem, deleta o arquivo
      if (anotacao.midia) {
        const caminhoArquivo = path.join('uploads', anotacao.midia);
        if (fs.existsSync(caminhoArquivo)) {
          fs.unlinkSync(caminhoArquivo);
        }
      }

      await prisma.anotacao.delete({
        where: { id }
      });

      res.status(204).send();
    } catch (erro) {
      console.error('Erro ao deletar anotação:', erro);
      res.status(500).json({ erro: 'Erro ao deletar anotação.' });
    }
  }
};

module.exports = anotacoesController; 