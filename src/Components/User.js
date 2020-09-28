import React from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

class User extends React.Component {

  state = {
    username: '',
    password: '',
    stayLoggedIn: false,
    friendships: [],
    myFriends: [],
    myGames: []
  }

  componentDidMount(){
    this.getFriendships()
  }

  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }


  getFriendships = () =>{
      fetch('http://localhost:3001/friendships')
      .then(res => res.json())
      .then(friendships =>{
        // console.log(friendships)
        this.findFriendships(friendships)  
      })
  }

  findFriendships = (friendships) =>{
    let myFriendships = friendships.filter(friends =>{
        if(friends.user1_id === this.props.userId || friends.user2_id === this.props.userId){
            return friends
        }
        return
    })
    this.setState({
        ...this.state,
        friendships: myFriendships
    }, () => this.findFriends())
  }

  findFriends = () =>{
    fetch('http://localhost:3001/users')
      .then(res => res.json())
      .then(users =>{
        // console.log(users)
        this.getFriends(users)
    })
  }

  getFriends = (users) =>{
      //console.log(users)
      let myFriendIds = this.state.friendships.map(friendship =>{
          if(friendship.user1_id === this.props.userId){
            return friendship.user2_id
          }else if(friendship.user2_id === this.props.userId){
            return friendship.user1_id
          }
      })
      let myFriends = myFriendIds.map(id =>{
          for(let i=0; i < users.length; i++){
            if(users[i].id === id){
                return users[i]
            }
          }
      })
      this.setState({
        ...this.state,
        myFriends: myFriends
      }, () => {
            this.renderFriends()
            this.getGames()
        })
  }

  renderFriends = () =>{
    let i = 0
    return this.state.myFriends.map(friend =>{
        i++
        return <div key={i}>
                    <h2 style={{marginTop:'30px'}}>{friend.username}
                        <Link to='/game'><button id="start-game" type="start-game" 
                        value="start-game" 
                        style={{position:'absolute', right:'20px'}}>Start Game</button></Link>

                    </h2>   
                </div>
    })
  }

  getGames = () =>{
    fetch('http://localhost:3001/games')
    .then(res => res.json())
    .then(games =>{
      this.findGames(games)  
    })
  }

  findGames = (games) =>{
    let myGames = games.filter(game =>{
        if(game.user1_id === this.props.userId || game.user2_id === this.props.userId){
            return game
        }
        return
    })
    // console.log(myGames)
    this.setState({
        ...this.state,
        myGames: myGames
    }, () => this.renderGames())
  }

  renderGames = () =>{
    let i = 0
    return this.state.myGames.map(game =>{
        i++
        let opponentName = this.getOpponentName(game)
        return <div key={i}>
                    <h2 style={{marginTop:'30px'}}>
                        {`vs. ${opponentName}`}
                        <Link to='/game'><button id="continue-game" type="continue-game" 
                        value="continue-game" onClick={() => this.handleContinueClick(game, opponentName)}
                        style={{position:'absolute', right:'20px'}}>Continue Game</button></Link>
                    </h2>   
                </div>
    })
  }

  getOpponentName = (game) =>{
      let opponent = this.state.myFriends.filter(friend =>{
          if(game.user1_id === friend.id || game.user2_id === friend.id){
              return friend
          }
      })
      return opponent[0].username
  }

  handleLogOutClick = () => {
    // console.log(this.props)
    this.props.handleLogOut()
  }

  handleContinueClick = (game, opponentName) => {
    // console.log(game)
    this.props.handleContinue(game, opponentName)
  }
   
  render(){
    return (
        <div>
            <div className='background'></div>
            <div className='crab1'></div>
            <div className="user-info">
                <div className="username-block">
                    <div className="user-page-form" style={{marginTop:'10px', maxWidth:'900px', textAlign: 'left', padding: '35px'}}>
                        <h2 style={{fontSize: '40px'}}> Hello {this.props.username} ! </h2>   
                        <Link to='/login'><button id="logout" value="logout" onClick={this.handleLogOutClick}
                                            style={{marginTop:'10px', width:'20%'}}>Log Out </button></Link>
                    </div>
                </div>
                <div className="friends-block">
                    <div className="user-page-form" style={{marginTop:'10px', marginBottom:'10px', maxWidth:'100%', height:'640px', textAlign: 'left', padding: '35px'}}>
                        <h2 style={{fontSize: '40px'}}> Friends </h2>   
                        {this.renderFriends()}                       
                    </div>
                </div>
                <div className="active-games-block">
                    <div className="user-page-form" style={{marginTop:'10px', maxWidth:'100%', height:'640px', textAlign: 'left', padding: '35px'}}>
                        <h2 style={{fontSize: '40px'}}> ActiveGames </h2>   
                        {this.renderGames()}   
                    </div>
                </div>
            </div>              
        </div>

        
    )
  }
}

export default withRouter(User);