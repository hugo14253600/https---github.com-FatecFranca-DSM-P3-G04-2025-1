const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarios');
const autenticar = require('../middleware/auth');

// Rotas públicas
router.post('/registrar', usuarioController.registrar);

// Rotas protegidas
router.get('/', autenticar, usuarioController.listar);
router.put('/:id', autenticar, usuarioController.atualizar);
router.delete('/:id', autenticar, usuarioController.deletar);

module.exports = router;
