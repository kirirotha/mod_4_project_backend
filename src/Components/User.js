import React from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import Tiles from './Tiles'

class User extends React.Component {

  state = {
    username: '',
    password: '',
    stayLoggedIn: false,
    friendships: [],
    myFriends: [],
    myGames: [],
    friendsearch: false,
    searchInput: "",
    users:[]
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
        this.setState({
          ...this.state,
          users: users
        })
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
        if(friend !== undefined){
          return <div key={i}>
                      <h2 style={{marginTop:'30px'}}>{friend.username ? friend.username : null}
                          
                        {this.renderFriendsButton(friend)}
                      </h2>   
                  </div>
        }
    })
  }

  renderFriendsButton = (friend) => {
    let friendship = this.state.friendships.filter(friendship => friendship.user1_id === friend.id || friendship.user2_id === friend.id)
    if(friendship[0] !== undefined){ 
      if(friendship[0].accepted === false && friendship[0].user2_id === this.props.userId){
        return(
          <>
                <button id="accept-friendship" type="accept-friendship" 
                    value="accept-friendship" onClick={() => this.handleAcceptFriendsClick(friendship)}
                    style={{position:'absolute', right:'140px', backgroundColor: 'green', width: '100px'}}>Accept</button>
              <button id="decline-friendship" type="decline-friendship" 
                    value="decline-friendship" onClick={() => this.handleDeclineFriendsClick(friendship)}
                    style={{position:'absolute', right:'20px', backgroundColor: 'red', width: '100px'}}>Decline</button>
          </>
          )
        }else if(friendship[0].accepted === false && friendship[0].user1_id === this.props.userId){
          return(<button id="pending-friend" type="pending-friend" 
                            style={{position:'absolute', right:'20px', backgroundColor: 'grey'}}>Pending</button>
          )
        }else{
          return(<button id="start-game" type="start-game" 
                            value={friend.id} onClick={this.handleStartNewClick}
                            style={{position:'absolute', right:'20px'}}>Start Game</button>
        )
      }
    }
  }

  handleAcceptFriendsClick = (friendship) =>{
    // console.log(friendship)
    this.acceptFriends(friendship)
  }

  handleDeclineFriendsClick = (friendship) =>{
    // console.log(friendship)
    this.declineFriends(friendship)
  }

  acceptFriends = (friendship) =>{
    console.log(this.state.friendships)
    let friendshipList =this.state.friendships.map(friend =>{
      if(friend.id === friendship[0].id){
        return {...friend, accepted: true}
      }else{
        return friend
      }
    })
    // console.log(friendshipList)
    this.setState({
      ...this.state,
      friendships: friendshipList
    },
    ()=> this.patchFriendship(friendship)
    )
  }

  declineFriends = (friendship) =>{
    let friendshipList = this.state.friendships.filter(friend => friend.id !== friendship[0].id)
    // console.log(this.state.friendships)
    // console.log(friendshipList)
    let friendList = this.state.myFriends.filter(friend => friend.id !== friendship[0].user1_id)
    this.setState({
      ...this.state,
      myFriends: friendList,
      friendships: friendshipList
    },
    () => this.deleteFriendship(friendship)
    )
  }

  deleteFriendship = (friendship) =>{
    fetch(`http://localhost:3001/friendships/${friendship[0].id}`, {
      method: 'DELETE'
    })
    .then(res => res.json())
  }

  patchFriendship = (friendship) =>{
    let patchData = friendship[0]
    let patchDataFix = {...patchData, accepted: true}
    fetch(`http://localhost:3001/friendships/${friendship[0].id}`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(patchDataFix)
    })
    .then(res => res.json())
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
        let userScore = this.getUserScore(game)
        return <div key={i}>
                    <h2 style={{marginTop:'30px'}}>
                        
                        {this.renderGameButton(game,opponentName,userScore)}
                    </h2>   
                </div>
    })
  }

  renderGameButton = (game, opponentName, userScore) => {
    if(this.props.userId === game.user2_id && game.accepted === false){
      return(<div>{`vs. ${opponentName}`}<button id="pending" type="pending" 
      value="pending" 
      style={{position:'absolute', right:'20px', backgroundColor: 'grey'}}>Pending</button> </div>)
    }else if(this.props.userId === game.user1_id && game.accepted === false){
      return(<div>{`vs. ${opponentName}`}<Link to='/game'><button id="accept-game" type="accept-game" 
      value="accept-game" onClick={() => this.handleAcceptGameClick(game, opponentName, userScore)}
      style={{position:'absolute', right:'140px', backgroundColor: 'green', width: '100px'}}>Accept</button></Link><button id="decline-game" type="decline-game" 
      value="decline-game" onClick={() => this.handleDeclineGameClick(game)}
      style={{position:'absolute', right:'20px', backgroundColor: 'red', width: '100px'}}>Decline</button></div>)
    }else if((this.props.userId === game.user1_id && game.player1turn === true) || (this.props.userId === game.user2_id && game.player1turn === false)){
      return(<div>{`vs. ${opponentName}`}<Link to='/game'><button id="continue-game" type="continue-game" 
      value="continue-game" onClick={() => this.handleContinueClick(game, opponentName, userScore)}
      style={{position:'absolute', right:'20px'}}>Your Turn</button></Link></div>)
    }else{
      return(<div>{`vs. ${opponentName}`}<Link to='/game'><button id="continue-game" type="continue-game" 
      value="continue-game" onClick={() => this.handleContinueClick(game, opponentName, userScore)}
      style={{position:'absolute', right:'20px', backgroundColor: 'purple'}}>{`${opponentName}'s Turn`}</button></Link></div>)
    }
  }

  handleAcceptGameClick = (game, opponentName, userScore) =>{
    let newTiles =this.setTiles()
    this.props.setTiles(newTiles, opponentName, game.user1_id, game.user2_id, game.id)
  }

  handleDeclineGameClick = (game) =>{
    this.declineGame(game)
  }

  declineGame = (game) =>{
    let myGames = this.state.myGames.filter(myGame => myGame.id !== game.id)
    this.setState({
      ...this.state,
      myGames: myGames
    },
    () => this.deleteGame(game)
    )
  }

  getOpponentName = (game) =>{
      let opponent = this.state.myFriends.filter(friend =>{
          if(game.user1_id === friend.id || game.user2_id === friend.id){
              return friend
          }
      })
      return opponent[0].username
  }

  getUserScore = (game) =>{
    let userScore = ""
    if (this.props.userId === game.user1_id){
      userScore = game.user1_score
    }else{
      userScore = game.user2_score
    }
    return userScore
  }

  handleLogOutClick = () => {
    // console.log(this.props)
    this.props.handleLogOut()
  }

  handleContinueClick = (game, opponentName, userScore) => {
    // console.log(game)
    this.props.handleContinue(game, opponentName, userScore)
  }
   
  handleStartNewClick = (e) =>{
    // console.log(e.target.value)
    this.createNewGame(e.target.value)
  }


  setTiles = () =>{
    let unusedTiles =['A','A','A','A','A','A','A','A','A','B','B','C','C','D','D','D','E','E','E','E','E','E','E','E','E','E','E','E','F','F','G','G','G','H','H','I','I','I','I','I','I','I','I','I','J','K','L','L','L','L','M','M','N','N','N','N','N','O','O','O','O','O','O','O','O','P','P','P','Q','R','R','R','R','R','R','S','S','S','S','T','T','T','T','T','T','U','U','U','U','V','V','W','W','X','Y','Y', 'Z', '*', '*']
    let userBag1 = []
    let userBag2 = []
    for( let i = 0; i < 7; i++){
      let randIndex = Math.floor(Math.random() * unusedTiles.length)
      let drawnTile = unusedTiles.splice(randIndex, 1)[0]
      userBag1.push(drawnTile)
    }
    for( let i = 0; i < 7; i++){
      let randIndex = Math.floor(Math.random() * unusedTiles.length)
      let drawnTile = unusedTiles.splice(randIndex, 1)[0]
      userBag2.push(drawnTile)
    }
    let user1_bag = userBag1.join('_')
    let user2_bag = userBag2.join('_') 
    this.props.setTiles([user1_bag, user2_bag])
    return[user1_bag, user2_bag]
  }

  createNewGame = (id) => {
    let newTiles =this.setTiles()
    let newGame ={
    "user1_id": Number(id),
    "user2_id": this.props.userId,
    "user1_score": 0,
    "user2_score": 0,
    "user1_bag": newTiles[0],
    "user2_bag": newTiles[1],
    "accepted": false,
    "active": true,
    "player1turn": true
    }
    // console.log(newGame)
    this.renderNewGame(newGame)
    fetch('http://localhost:3001/games',{
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(newGame)
    })
    .then(res => res.json())
    .then(game =>{
      //console.log(game)
    })
  }

  renderNewGame = (newGame) => {
    let gameList = this.state.myGames
    gameList.push(newGame)
    this.setState({
      ...this.state,
      myGames: gameList
    })
  }

  handleFindFriendsClick = () =>{
    this.setState({
      ...this.state,
      friendsearch: !this.state.friendsearch
    })
  }

  handleSearchInputChange =(e) =>{
    this.setState({
      ...this.state,
      searchInput:e.target.value
    })
  }

  renderFriendsBlock = () =>{
    if(this.state.friendsearch === true){
      return(
        <div className="user-page-form" style={{marginTop:'10px', marginBottom:'10px', maxWidth:'100%', height:'640px', textAlign: 'left', padding: '35px'}}>
          <h2 style={{fontSize: '40px'}}> Search <button style={{marginLeft:'59px',top: '0px', backgroundColor:'purple'}} onClick={this.handleFindFriendsClick}>{this.state.friendsearch ? 'Back' : 'Find Friends'}</button></h2> 
          <input type="text" onChange={this.handleSearchInputChange} name='namesearch' placeholder="username search"  />
          {this.renderFriendSearch()}  
        </div>
      )
    }else{
      return(
        <div className="user-page-form" style={{marginTop:'10px', marginBottom:'10px', maxWidth:'100%', height:'640px', textAlign: 'left', padding: '35px'}}>
            <h2 style={{fontSize: '40px'}}> Friends <button style={{marginLeft:'49px',top: '0px', backgroundColor:'purple'}} onClick={this.handleFindFriendsClick}>{this.state.friendsearch ? 'Back' : 'Find Friends'}</button></h2>   
            {this.renderFriends(this.state.searchInput)}                       
        </div>
      )
    }
  }

  renderFriendSearch = () =>{
    let searchInput = this.state.searchInput
    let searchResults = []
    // console.log(searchInput)
    if (searchInput){
      searchResults = this.state.users.filter(user => searchInput.toLowerCase() === user.username.slice(0,searchInput.length).toLowerCase())
    }
    // console.log(searchResults)
    let i = 0
    return searchResults.map(friend =>{
        i++
        let friendship = this.state.friendships.filter(friendship => friendship.user1_id === friend.id || friendship.user2_id === friend.id)
        if(friendship[0] !== undefined){
              if(friendship[0].accepted === false && friendship[0].user1_id === this.props.userId){
                return <div key={i}>
                            <h2 style={{marginTop:'30px'}}>{friend.username}
                              <button id="pending-friend" type="pending-friend" 
                                    style={{position:'absolute', right:'20px', backgroundColor: 'grey'}}>Pending</button>
                            </h2>   
                        </div>
              }else{
                return <div key={i}>
                            <h2 style={{marginTop:'30px'}}>{friend.username}
                              <button id="already-friend" type="already-friend" 
                                    style={{position:'absolute', right:'20px', backgroundColor: 'grey'}}>Already Friends</button>
                            </h2>   
                        </div>
              }
         }else{
          return <div key={i}>
                      <h2 style={{marginTop:'30px'}}>{friend.username}
                          <button id="friend-request" type="friend-request" 
                          value={friend.id} onClick={this.handleFriendRequestClick}
                          style={{position:'absolute', right:'20px'}}>Friend Request</button>

                      </h2>   
                  </div>
         }
    })
  }

  handleFriendRequestClick = (e) =>{
    // console.log(e.target.value)
    this.makeFriends(e.target.value)
  }

  makeFriends = (id) =>{
    let friendshipData = {
      user1_id: this.props.userId,
      user2_id: Number(id),
      accepted: false,
      active: true,
    }
    this.renderNewFriend(friendshipData)
    fetch('http://localhost:3001/friendships',{
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body:JSON.stringify(friendshipData)
    })
    .then(res => res.json())
    .then(friendship =>{

    })
  }

  renderNewFriend = (friendship) =>{
    let friendshipList = this.state.friendships
    friendshipList.push(friendship)
    let myFriends = this.state.myFriends
    let myFriend = this.state.users.filter(user => user.id === friendship.user2_id)
    myFriends.push(myFriend[0])
    this.setState({
      ...this.state,
      friendships: friendshipList,
      myFriends: myFriends
    })
  }

  deleteGame = (game) =>{
    fetch(`http://localhost:3001/games/${game.id}`, {
      method: 'DELETE'
    })
    .then(res => res.json())
  }

  render(){
    return (
        <div>
            <div className='background'></div>
            <div className='crab1'></div>
            <div className="user-info">
                <div className="username-block">
                    <div className="user-page-top-form" style={{marginTop:'10px', maxWidth:'900px', textAlign: 'left', padding: '35px'}}>
                        <h2 style={{fontSize: '40px'}}> Hello {this.props.username} ! </h2>   
                        <Link to='/login'><button id="logout" value="logout" onClick={this.handleLogOutClick}
                                            style={{marginTop:'10px', width:'20%'}}>Log Out </button></Link>
                    </div>
                </div>
                <div className="friends-block">
                    {this.renderFriendsBlock()}
                </div>
                <div className="active-games-block">
                    <div className="user-page-form" style={{marginTop:'10px', maxWidth:'100%', height:'640px', textAlign: 'left', padding: '35px', backgroundPosition: 'right'}}>
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