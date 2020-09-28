import React from 'react';
import Board from './Board'
import LetterTile from './LetterTile'



import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

class Game extends React.Component {

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

  handleSubmit = () => {
    const newUser = {
      username: this.state.username,
      password: this.state.password
    }
    console.log(newUser)
  }

  getTiles = () =>{
    this.renderTile()
  }

  renderTile = () =>{
      return <LetterTile/>
  }

  renderUserScore = () =>{
    if(this.props.game.user1_id === this.props.userId){
        return <h1 style={{fontSize: '40px'}}> {this.props.game.user1_score} </h1> 
    }else if(this.props.game.user2_id === this.props.userId){
        return <h1 style={{fontSize: '40px'}}> {this.props.game.user2_score} </h1> 
    }else{
        return <h1 style={{fontSize: '40px'}}> -error- </h1> 
    }
  }

  renderOpponentScore = () =>{
    if(this.props.game.user1_id === this.props.userId){
        return <h1 style={{fontSize: '40px'}}> {this.props.game.user2_score} </h1> 
    }else if(this.props.game.user2_id === this.props.userId){
        return <h1 style={{fontSize: '40px'}}> {this.props.game.user1_score} </h1> 
    }else{
        return <h1 style={{fontSize: '40px'}}> -error- </h1> 
    }
  }

  render(){
    return (
        <div>
            <div className='background'></div>
            <div className='crab1'></div>
            <div>
                <Board game={this.props.game}/>
                <div className="scoreboard">
                    <div className="form" style={{marginTop:'10px', maxWidth:'100%', height:'560px', textAlign: 'left', padding: '35px'}}>
                        <h1 style={{fontSize: '40px'}}> Your Score: </h1> 
                        {this.renderUserScore()}
                        <br/>
                        <h1 style={{fontSize: '40px'}}> {`${this.props.opponentName}'s Score: `}</h1>  
                        {this.renderOpponentScore()}
                        <br/>
                        <button style={{marginTop:'50px'}}>Forfeit Game</button><br/><p/>
                        <Link to='/user'><button style={{marginTop:'10px'}}>Go Back To User Page</button></Link>

                    </div>
                </div>
                <div className="play-panel">
                    <div className="form" style={{marginTop:'0px',maxWidth:'100%', height:'72px', textAlign: 'left', padding: '20px'}}>
                        <button >Reset</button>
                        <button style={{marginRight: '30px'}}>Repick</button>
                        <button>Pass</button>
                        <button style={{marginRight: '0px'}}>Submit</button>
                    </div>
                </div>
            </div>            
        </div>

        
    )
  }
}

export default withRouter(Game);