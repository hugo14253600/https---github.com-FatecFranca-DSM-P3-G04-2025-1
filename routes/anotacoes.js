const express = require('express');
const router = express.Router();
const anotacoesController = require('../controllers/anotacoes');
const autenticar = require('../middleware/auth');

// Todas as rotas de anotações requerem autenticação
router.use(autenticar);

router.get('/', anotacoesController.listar);
router.post('/', anotacoesController.criar);
router.put('/:id', anotacoesController.atualizar);
router.delete('/:id', anotacoesController.deletar);

module.exports = router; 