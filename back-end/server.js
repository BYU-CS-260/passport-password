const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const morgan = require('morgan')
const passport = require('./passport');
// Route requires
const user = require('./routes/user')

const app = express()
const PORT = 3000

const clientP = mongoose.connect(
  'mongodb://localhost:27017/simple-mern-passport',
  { useNewUrlParser: true, useUnifiedTopology: true }
).then(m => m.connection.getClient())

// MIDDLEWARE
app.use(
	bodyParser.urlencoded({
		extended: false
	})
)
app.use(bodyParser.json())

app.use(session({
  secret: 'fraggle-rock', //pick a random string to make the hash that is generated secure
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    clientPromise: clientP,
    dbName: "simple-mern-passport",
    stringify: false,
    autoRemove: 'interval',
    autoRemoveInterval: 1
  })
}));

// Passport
app.use(passport.initialize())
app.use(passport.session()) // calls the deserializeUser


// Routes
app.use('/user', user)

// Starting Server 
app.listen(PORT, () => {
	console.log(`App listening on PORT: ${PORT}`)
})