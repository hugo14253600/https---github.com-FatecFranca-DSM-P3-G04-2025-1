// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login');
const autenticar = require('../middleware/auth');

router.post('/', loginController.login);
router.post('/logout', autenticar, loginController.logout);
router.get('/verificar', loginController.verificarAutenticacao);

module.exports = router;
