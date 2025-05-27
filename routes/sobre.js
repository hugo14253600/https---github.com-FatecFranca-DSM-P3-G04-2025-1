const express = require('express');
const router = express.Router();

// Rota que renderiza a página sobre
router.get('/', (req, res) => {
  res.sendFile('sobre.html', { root: 'views' });
});

module.exports = router;
