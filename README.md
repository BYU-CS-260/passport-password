# Passport
This tutorial will show you how to set up authentication using passwords with passport.

1. We are going to create a front end and a back end, so create a directory where your project will live "passport" and set up your React CLI in that directory
```
npx create-react-app front-end
cd front-end/
```
And add the proxy line to your package.json file
```
"proxy": "http://localhost:3000",
```
And create a file ".env.development.local" with the following content
```
DANGEROUSLY_DISABLE_HOST_CHECK=true
```
2. Now create a "components" folder in your React "src" directory.  
```
mkdir src/components
```
3. Create src/App.js with the following content
```js
import React, { Component } from 'react';
import axios from 'axios'
import { Route} from 'react-router-dom'
// components
import Signup from './components/signup'
import LoginForm from './components/login-form'
import Navbar from './components/navbar'
import Home from './components/home'

class App extends Component {
  constructor() {
    super()
    this.state = {
      loggedIn: false,
      username: null
    }

    this.getUser = this.getUser.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.updateUser = this.updateUser.bind(this)
  }

  componentDidMount() {
    this.getUser()
  }

  updateUser (userObject) {
    this.setState(userObject)
  }

  getUser() {
    axios.get('/user/').then(response => {
      console.log('Get user response: ')
      console.log(response.data)
      if (response.data.user) {
        console.log('Get User: There is a user saved in the server session: ')

        this.setState({
          loggedIn: true,
          username: response.data.user.username
        })
      } else {
        console.log('Get user: no user');
        this.setState({
          loggedIn: false,
          username: null
        })
      }
    })
  }

  render() {
    return (
      <div className="App">
   
        <Navbar updateUser={this.updateUser} loggedIn={this.state.loggedIn} />
        {/* greet user if logged in: */}
        {this.state.loggedIn &&
          <p>You are Authenticated, {this.state.username}!</p>
        }
        {/* Routes to different components */}
        <Route
          exact path="/"
          component={Home} />
        <Route
          path="/login"
          render={() =>
            <LoginForm
              updateUser={this.updateUser}
            />}
        />
        <Route
          path="/signup"
          render={() =>
            <Signup/>}
        />

      </div>
    );
  }
}

export default App;
```
App.js creates routes for home, login and signup and inserts a greeting if the user is authenticated.

4. Create src/components/home.js with the following content
```js
import React, { Component } from 'react'

class Home extends Component {
    constructor() {
        super()
    }

    render() {
        return (
            <div>
                <p>It's good to be home</p>
            </div>
        )

    }
}
```
The home.js component just displays a simple message.  If we are authenticated, then App.js will display our username.

5. Create src/components/login-form.js with the following content
```js
import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'

class LoginForm extends Component {
    constructor() {
        super()
        this.state = {
            username: '',
            password: '',
            redirectTo: null
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit(event) {
        event.preventDefault()
        axios
            .post('/user/login', {
                username: this.state.username,
                password: this.state.password
            })
            .then(response => {
                if (response.status === 200) {
                    // update App.js state
                    this.props.updateUser({
                        loggedIn: true,
                        username: response.data.username
                    })
                    // update the state to redirect to home
                    this.setState({
                        redirectTo: '/'
                    })
                }
            }).catch(error => {
                console.log('login error: ')
                console.log(error);
            })
    }

    render() {
        if (this.state.redirectTo) {
            return <Redirect to={{ pathname: this.state.redirectTo }} />
        } else {
            return (
                <div>
                    <h4>Login</h4>
                    <form >
                        <input 
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Username"
                            value={this.state.username}
                            onChange={this.handleChange}
                        />
                        <input
                            placeholder="password"
                            type="password"
                            name="password"
                            value={this.state.password}
                            onChange={this.handleChange}
                        />
                        <button
                            onClick={this.handleSubmit}
                            type="submit">Login
                        </button>
                    </form>
                </div>
            )
        }
    }
}

export default LoginForm

```
6. Create src/components/navbar.js with the following content
```js
import React, { Component } from 'react'
import {Link } from 'react-router-dom'
import axios from 'axios'

class Navbar extends Component {
    constructor() {
        super()
        this.logout = this.logout.bind(this)
    }

    logout(event) {
        event.preventDefault()
        console.log('logging out')
        axios.post('/user/logout').then(response => {
          console.log(response.data)
          if (response.status === 200) {
            this.props.updateUser({
              loggedIn: false,
              username: null
            })
          }
        }).catch(error => {
            console.log('Logout error')
        })
      }

    render() {
        const loggedIn = this.props.loggedIn;
        console.log('navbar render, props: ')
        console.log(this.props);
        
        return (
            <div>
                {loggedIn ? (
                    <Link to="#"  onClick={this.logout}>
                    <span >logout</span></Link>
                ) : (
                    <div>
                        <Link to="/">
                            <span> home </span>
                        </Link>
                        <Link to="/login" >
                            <span > login </span>
                        </Link>
                        <Link to="/signup" >
                            <span > sign up </span>
                        </Link>
                    </div>
                )}
                <h1 > Passport</h1>
            </div>
        );
    }
}

export default Navbar
```
The Navbar component just displays the options based on whether you are logged in or not.

7. Create src/components/signup.js with the following content
```js
import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'

class Signup extends Component {
	constructor() {
		super()
		this.state = {
			username: '',
			password: '',
			confirmPassword: '',
		}
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleChange = this.handleChange.bind(this)
	}
	handleChange(event) {
		this.setState({
			[event.target.name]: event.target.value
		})
	}
	handleSubmit(event) {
		event.preventDefault()
		//request to server to add a new username/password
		axios.post('/user/signup', {
			username: this.state.username,
			password: this.state.password
		})
			.then(response => {
				if (!response.data.errmsg) {
					this.setState({
                        redirectTo: '/login'
                    })
				} 
			}).catch(error => {
				console.log('signup error: ')
				console.log(error)
			})
	}

	render() {
		if (this.state.redirectTo) {
	        return <Redirect to={{ pathname: this.state.redirectTo }} />
	    } else {
			return (
				<div>
					<h4>Sign up</h4>
					<form >
						<input className="form-input"
							type="text"
							id="username"
							name="username"
							placeholder="Username"
							value={this.state.username}
							onChange={this.handleChange}
						/>
						<input className="form-input"
							placeholder="password"
							type="password"
							name="password"
							value={this.state.password}
							onChange={this.handleChange}
						/>
						<button
							onClick={this.handleSubmit}
							type="submit"
						>Sign up</button>
					</form>
				</div>
			)
		}
	}
}

export default Signup
```
The Signup component performs a post to create a new user and then login page.

8. Test to see if your front end works by running
```
npm start
```
You may see errors because the back end is not working yet.

9. Create a "back-end" directory with subdirectories "database", "routes" and "passport".
```
mkdir back-end
mkdir back-end/database
mkdir back-end/routes
mkdir back-end/passport
```

10. create a file back-end/server.js with the following content
```js
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const dbConnection = require('./database') 
const MongoStore = require('connect-mongo')(session)
const passport = require('./passport');
const app = express()
const PORT = 3000
// Route requires
const user = require('./routes/user')

// MIDDLEWARE
app.use(
	bodyParser.urlencoded({
		extended: false
	})
)
app.use(bodyParser.json())

// Sessions
app.use(
	session({
		secret: 'fraggle-rock', //pick a random string to make the hash that is generated secure
		store: new MongoStore({ mongooseConnection: dbConnection }),
		resave: false, //required
		saveUninitialized: false //required
	})
)

// Passport
app.use(passport.initialize())
app.use(passport.session()) // calls the deserializeUser


// Routes
app.use('/user', user)

// Starting Server 
app.listen(PORT, () => {
	console.log(`App listening on PORT: ${PORT}`)
})
```
The "server.js" file imports the other back end files, and initializes the sessions and passport modules.

11. Create "routes/users.js" with the following content
```js
const express = require('express')
const router = express.Router()
const User = require('../database/models/user')
const passport = require('../passport')

router.post('/signup', (req, res) => {
    console.log('user signup');

    const { username, password } = req.body
    // ADD VALIDATION
    User.findOne({ username: username }, (err, user) => {
        if (err) {
            console.log('User.js post error: ', err)
        } else if (user) {
            res.json({
                error: `Sorry, already a user with the username: ${username}`
            })
        }
        else {
            const newUser = new User({
                username: username,
                password: password
            })
            newUser.save((err, savedUser) => {
                if (err) return res.json(err)
                res.json(savedUser)
            })
        }
    })
})

router.post(
    '/login',
    function (req, res, next) {
        console.log('routes/user.js, login, req.body: ');
        console.log(req.body)
        next()
    },
    passport.authenticate('local'),
    (req, res) => {
        console.log('logged in', req.user);
        var userInfo = {
            username: req.user.username
        };
        res.send(userInfo);
    }
)

router.get('/', (req, res, next) => {
    console.log('===== user!!======')
    console.log(req.user)
    if (req.user) {
        res.json({ user: req.user })
    } else {
        res.json({ user: null })
    }
})

router.post('/logout', (req, res) => {
    if (req.user) {
        req.logout()
        res.send({ msg: 'logging out' })
    } else {
        res.send({ msg: 'no user to log out' })
    }
})

module.exports = router
```
The POST route for "/signup" handles the requests from axios "/user/signup".  The POST route for /login handles the axios request for "/user/login". The GET route for "/" handles requests from axios "/user".  The "/user" part of the route is prepended due to them being in a user.js file.  The "/signup" route calls the database to see if the username already exists and will save the hashed password if everything works.  The "/login" route authenticates using the "local" strategy.  This code could be changed to authenticate with google or facebook authentication.

11. Create "models/index.js" with the following content
```js
//Connect to Mongo database
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

//your local database url
//27017 is the default mongoDB port
const uri = 'mongodb://localhost:27017/simple-passport' 

mongoose.connect(uri).then(
    () => { 
        /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ 
        console.log('Connected to Mongo');
        
    },
    err => {
         /** handle initial connection error */ 
         console.log('error connecting to Mongo: ')
         console.log(err);
         
        }
  );


module.exports = mongoose.connection
```
This module connects to the mongo database using mongoose.

12. Create "passport/index.js" with the following content
```js
const passport = require('passport')
const LocalStrategy = require('./localStrategy')
const User = require('../database/models/user')

// called on login, saves the id to session req.session.passport.user = {id:'..'}
passport.serializeUser((user, done) => {
	console.log('*** serializeUser called, user: ')
	console.log(user) // the whole raw user object!
	console.log('---------')
	done(null, { _id: user._id })
})

// user object attaches to the request as req.user
passport.deserializeUser((id, done) => {
	console.log('DeserializeUser called')
	User.findOne(
		{ _id: id },
		'username',
		(err, user) => {
			console.log('*** Deserialize user, user:')
			console.log(user)
			console.log('--------------')
			done(null, user)
		}
	)
})

//  Use Strategies 
passport.use(LocalStrategy)

module.exports = passport
```
This module saves the session information.

13. Create "passport/localStrategy.js" with the following content
```js
const User = require('../database/models/user')
const LocalStrategy = require('passport-local').Strategy

const strategy = new LocalStrategy(
	{
		usernameField: 'username' // not necessary, DEFAULT
	},
	function(username, password, done) {
		User.findOne({ username: username }, (err, user) => {
			if (err) {
				return done(err)
			}
			if (!user) {
				return done(null, false, { message: 'Incorrect username' })
			}
			if (!user.checkPassword(password)) {
				return done(null, false, { message: 'Incorrect password' })
			}
			return done(null, user)
		})
	}
)

module.exports = strategy
```
This module defines the local strategy of looking up the hashed password and comparing it to password entered by the user.

14. You should now be able to test the whole application by running the following in the back-end directory
```
node server.js
```
And the following in the front-end directory
``` 
npm start
```
15. Try adding a username and password and making sure that you can authenticate using those credentials.  Notice that the back end produces a lot of debug information.  Note that the password stored in the database is the hash of the password you present.  If someone were to break into your database, they could not get a list of passwords for your users.
