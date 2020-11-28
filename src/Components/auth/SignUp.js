import React from 'react';
import { withRouter } from 'react-router';


import { Link } from 'react-router-dom';


class SignUp extends React.Component {

  state = {
    username: '',
    password: '',
    stayLoggedIn: false
  }

  handleInputChange = (e) => {
    // console.log(e.target.name)
    // console.log(e.target.value)
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit = (e) => {
    // console.log('click')
    e.preventDefault()
    const newUser = {
      user:{
        username: this.state.username,
        password: this.state.password,
        wins: 0,
        losses: 0
      }
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
        if (token.auth_key){
          // console.log(token.user_id)
            localStorage.setItem('auth_key',token['auth_key'])
            localStorage.setItem('username',this.state.username)
            localStorage.setItem('userId',this.state.userId)
            localStorage.setItem('wins', 0 )
            localStorage.setItem('losses', 0)
            this.props.handleLogIn(this.state.username, token.user_id, 0, 0)
            this.props.history.push('/user')
        }else{
            this.props.failedLogIn()
            this.props.history.push('/login')
        }
    })
  }


  render(){
    return (
        <div>
            <div className='background'></div>
            <div className='crab1'></div>
            <div className='large-logo'></div>
            <div className="login-page">
                <div className="form">
                    <form className="login-form"onSubmit={this.handleSubmit}>
                        <h2> Create Account </h2>
                        <input type="text" onChange={this.handleInputChange} name='username' placeholder="Username"  />
                        <input type="password" onChange={this.handleInputChange} name='password' placeholder="Password"/>
                        <input type="password" onChange={this.handleInputChange} name='password-verify' placeholder="Verify Password"/>
                        <button id="submit" type="submit" value="Submit">create account </button>
                        <p className="message">Already have an account? <Link to='/login'>Click Here</Link></p>
                    </form>
                </div>
            </div>            
        </div>

        
    )
  }
}
export default withRouter(SignUp);
