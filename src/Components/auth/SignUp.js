import React from 'react';

import { Link } from 'react-router-dom';


class SignUp extends React.Component {

  state = {
    username: '',
    password: '',
    stayLoggedIn: false
  }

  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit = (e) => {
    //e.preventDefault()
    const newUser = {
      username: this.state.username,
      password: this.state.password
    }
    console.log(newUser)
    fetch('http://localhost:3001/signup',{
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(newUser)
    })
    .then(res =>res.json())
    .then(token=> {
        console.log(token)
        //localStorage.setItem('auth_key', token['auth_key'])
    })
  }

  render(){
    return (
        <div>
            <div className='background'></div>
            <div className='crab1'></div>
            <div className="login-page">
                <div className="form">
                    <form className="login-form"onSubmit={this.handleSubmit}>
                        <h2> Create Account </h2>
                        <input type="text" onChange={this.handleInputChange} name='username' placeholder="Username"  />
                        <input type="password" onChange={this.handleInputChange} name='password' placeholder="Password"/>
                        <input type="password" onChange={this.handleInputChange} name='password-verify' placeholder="Verify Password"/>
                        <Link to='/user'><button id="submit" type="submit" value="Submit">create account </button></Link>
                        <p className="message">Already have an account? <Link to='/login'>Click Here</Link></p>
                    </form>
                </div>
            </div>            
        </div>

        
    )
  }
}

export default SignUp;