# Passport
This tutorial will show you how to set up authentication using passwords with passport.

1. We are going to create a front end and a back end, so create a directory where your project will live "passport" and set up your React CLI in that directory
```
npx create-react-app front-end
cd front-end/
```
2. Now create a "components" folder in your React "src" directory.  
```
mkdir src/components
```
3. Create src/components/home.js with the following content
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
4. Create src/components/login-form.js with the following content
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
5. Create src/components/navbar.js with the following content
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

6. Create src/components/signup.js with the following content
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
		axios.post('/user/', {
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
