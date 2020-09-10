require('dotenv').config()
const massive = require('massive')
const express = require('express')
const session = require('express-session')
const authCtrl = require('./controllers/authController')
const secretCtrl = require('./controllers/secretsController')
const {
  authenticateUser,
  checkAdminStatus,
} = require('./middlewares/authenticateUser')

const app = express()

const { SERVER_PORT, CONNECTION_STRING, SESSION_SECRET } = process.env

app.use(express.json())
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 365 },
  })
)

app.post('/auth/register', authCtrl.register)
app.post('/auth/login', authCtrl.login)
app.delete('/auth/logout', authCtrl.logout)
app.get('/session', authCtrl.getSession)

// REQUEST LEVEL MIDDLEWARE EXAMPLES
app.get(
  '/api/secrets/admin',
  authenticateUser,
  checkAdminStatus,
  secretCtrl.getAdminSecret
)
app.get('/api/secrets/normal', authenticateUser, secretCtrl.getSecret)

massive({
  connectionString: CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false,
  },
}).then((dbInstance) => {
  app.set('db', dbInstance)
  console.log('I see the DB, and it opened up my eyes, I saw the db')
  app.listen(SERVER_PORT, () => console.log(`We are on port ${SERVER_PORT}`))
})
