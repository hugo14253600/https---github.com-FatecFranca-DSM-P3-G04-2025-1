const express = require('express')
const router = express.Router()
const dicasController = require('../controllers/dicas')
const autenticar = require('../middleware/auth')

router.get('/', dicasController.listar)
router.post('/', autenticar, dicasController.criar)

module.exports = router
