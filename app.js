require('dotenv').config()
const express = require('express')
const session = require('express-session')
const path = require('path')
const app = express()

const dicasRoutes = require('./routes/dicas')
const usuariosRoutes = require('./routes/usuarios')
const loginRoutes = require('./routes/login')
const sobreRoutes = require('./routes/sobre')
const anotacoesRoutes = require('./routes/anotacoes')

// Configuração do middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Configuração para servir arquivos estáticos
app.use(express.static(path.join(__dirname)))
app.use('/views', express.static(path.join(__dirname, 'views')))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Configuração da sessão
app.use(session({
  secret: process.env.SESSION_SECRET || 'chave-secreta-padrao',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}))

// Rotas principais para as páginas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'))
})

app.get('/criar-conta', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'criarConta.html'))
})

app.get('/dicas', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'dicas.html'))
})

app.get('/sobre', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'sobre.html'))
})

app.get('/anotacoes', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'anotacoes.html'))
})

app.get('/galeria', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'galeria.html'))
})

// Rotas da API
app.use('/api/dicas', dicasRoutes)
app.use('/api/usuarios', usuariosRoutes)
app.use('/api/login', loginRoutes)
app.use('/api/sobre', sobreRoutes)
app.use('/api/anotacoes', anotacoesRoutes)

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Algo deu errado!' })
})

const PORT = process.env.PORT || 3002
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))
