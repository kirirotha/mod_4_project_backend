import React, { Component } from 'react';
import './App.css';

import Login from './Components/auth/Login'
import SignUp from './Components/auth/SignUp'
import User from './Components/User'
import Game from './Components/Game'




import {
  BrowserRouter,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import Tiles from './Components/Tiles';

// import staticBooks from './books'

class App extends Component {
  state ={
    loggedIn: false,
    username: "",
    userId: "",
    game: "",
    opponentName: "",
    userScore: "",
    myGames: [],
    friendships: [],
    myFriends: [],
    users:[],
    wins: "",
    losses: ""
  }

  componentDidMount(){
    if(localStorage.getItem('auth_key')){
      this.setState({
        ...this.state,
        username: localStorage.getItem('username'),
        userId: localStorage.getItem('userId'),
        loggedIn: true,
        myGames: JSON.parse(localStorage.getItem('myGames')),
        myFriends: JSON.parse(localStorage.getItem('myFriends')),
        friendships: JSON.parse(localStorage.getItem('friendships')),
        wins: JSON.parse(localStorage.getItem('wins')),
        losses: JSON.parse(localStorage.getItem('losses'))
      },
      )
    }
  }

  handleLogIn = (username, userId, wins, losses) =>{
    if(localStorage.getItem('auth_key')){
      this.setState({
        ...this.state,
        loggedIn: true,
        username: username,
        userId: userId, 
        wins: wins,
        losses: losses
      },
      () => this.getFriendships()
      )
      // console.log('logging in')
    }
  }

  failedLogIn = () =>{
    localStorage.clear()
    this.setState({
      ...this.state,
      loggedIn: false,
      username: ""
    }, () =>{
      return <Redirect push to="/login" />
    })
  }

  handleLogOut = () =>{
    localStorage.clear()
    this.setState({
      ...this.state,
      loggedIn: false,
      username: "",
      userId: ""
    }, () =>{
      return <Redirect push to="/login" />
    })
  }

  handleContinue = (game, opponentName, userScore) =>{
    // console.log(game)
    this.setState({
      ...this.state,
      game: game,
      opponentName: opponentName,
      userScore: userScore
    })
  }

  updateScore = (newScore) =>{
    // console.log(newScore)
    this.setState({
      ...this.state,
      userScore: newScore,
    })
  }

  setTiles = (newTiles, opponentName, user1_id, user2_id, game_id) =>{
    console.log(newTiles)
    this.setState({
      ...this.state,
      game: {...this.state.game,
        id: game_id,
        user1_id: user1_id,
        user2_id: user2_id,
        user1_bag: newTiles[0],
        user2_bag: newTiles[1],
        accepted: true,
        active: true,
        player1turn: true,
        user1_score: 0,
        user2_score: 0
      },
      opponentName: opponentName
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
      if(friends.user1_id === this.state.userId || friends.user2_id === this.state.userId){
          return friends
      }
      return
  })
  this.setState({
      ...this.state,
      friendships: myFriendships
  }, () => {
    this.findFriends()
    localStorage.setItem('friendships', JSON.stringify(myFriendships))
  })
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
        if(friendship.user1_id === this.state.userId){
          return friendship.user2_id
        }else if(friendship.user2_id === this.state.userId){
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
            localStorage.setItem('myFriends', JSON.stringify(myFriends))
          this.getGames()
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
      if(game.user1_id === this.state.userId || game.user2_id === this.state.userId){
          return game
      }
      return
  })
  // console.log(myGames)
  this.setState({
      ...this.state,
      myGames: myGames
  },
  () => {localStorage.setItem('myGames', JSON.stringify(myGames))}
  )
}

declineGame = (game) =>{
  let myGames = this.state.myGames.filter(myGame => myGame.id !== game.id)
  this.setState({
    ...this.state,
    myGames: myGames
  },
  () => {localStorage.setItem('myGames', JSON.stringify(myGames))}
  )
}

  acceptFriends = (friendshipList) =>{
    this.setState({
      ...this.state,
      friendships: friendshipList
    },
    () => {localStorage.setItem('friendships', JSON.stringify(friendshipList))}
    )
  }

  updateFriends = (friendList, friendshipList) =>{
    this.setState({
      ...this.state,
      myFriends: friendList,
      friendships: friendshipList
    },
    () => {
      localStorage.setItem('friendships', JSON.stringify(friendshipList))
      localStorage.setItem('myFriends', JSON.stringify(friendList))
      }
    )
  }
   
  startNewGame = (newGame) =>{
    let gameList = this.state.myGames
    gameList.push(newGame)
    this.setState({
      ...this.state,
      myGames: gameList
    },
    () => {localStorage.setItem('myGames', JSON.stringify(gameList))}
    )
  }

  updateGame = (newScore) =>{
    let player1turn = this.state.game.player1turn
    if (this.state.game.user1_id === this.state.userId){
      this.setState({
        ...this.state,
          game:{
            ...this.state.game,
            user1_score: newScore,
            player1turn: !player1turn
          }
      },
      () => this.updateGames()
      )
    }else if (this.state.game.user2_id === this.state.userId){
      this.setState({
        ...this.state,
          game:{
            ...this.state.game,
            user2_score: newScore,
            player1turn: !player1turn
          }
      },
      () => this.updateGames()
      )
    }
  }

  updateGames = () =>{
    let gameList = this.state.myGames.filter(game => game.id !== this.state.game.id)
    gameList.push(this.state.game)
    this.setState({
      ...this.state,
      myGames: gameList
    })
  }

  render(){

    // const loggedIn = () =>{localStorage.getItem('auth_key') ? true : false }

    return (
      <div className="parent" >
        <BrowserRouter>


          <Switch>

            <Route exact path="/" component={() => {
              if(localStorage.getItem('auth_key')){
                return <User handleLogOut={this.handleLogOut}/>
              }else{
                return <Redirect to="/login" />
              }
            }} />

            <Route path="/login" component={() =>{
              return <Login handleLogIn={this.handleLogIn} failedLogIn={this.failedLogIn}/> 
            }}/>

            <Route path="/signup" component={()=>{
              return <SignUp handleLogIn={this.handleLogIn} failedLogIn={this.failedLogIn}/> 
            }} />

            <Route path="/user" component={() => {
              return <User handleLogOut={this.handleLogOut} username={this.state.username}
                            wins={this.state.wins} losses={this.state.losses} 
                            userId={this.state.userId} handleContinue={this.handleContinue}
                            myFriends={this.state.myFriends} myGames={this.state.myGames}
                            friendships = {this.state.friendships} declineGame={this.declineGame}
                            acceptFriends={this.acceptFriends} updateFriends={this.updateFriends}
                            startNewGame={this.startNewGame} setTiles={this.setTiles}/>}} />

            <Route path="/game" component={() => {
              if(localStorage.getItem('auth_key')){
                if(this.state.game !== ""){
                  return <Game handleLogOut={this.handleLogOut} username={this.state.username} opponentName={this.state.opponentName}
                            userId={this.state.userId} backToUser={this.backToUser} game={this.state.game} updateScore={this.updateScore} 
                            updateGame={this.updateGame}
                            userScore={this.state.userScore}/>
                }else{  
                  return <Redirect to="/user" />
                }
              }else{
                return <Redirect to="/login" />
              }
            }} />
      
            <Route path="/logout" component={() => {
              localStorage.clear()
              this.handleLogOut()
              return <Redirect to="/login" />
            }} />

            <Route>
              <Redirect to="/" />
            </Route>

          </Switch>

        </BrowserRouter>
      </div>
    );
  }
}

export default App;