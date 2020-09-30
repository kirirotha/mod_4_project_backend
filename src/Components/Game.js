import React from 'react';
import Board from './Board'
import LetterTile from './LetterTile'
// import Tiles from './Tiles'


import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

class Game extends React.Component {



  state = {
    username: '',
    password: '',
    stayLoggedIn: false,
    unusedTiles: ['A','A','A','A','A','A','A','A','A','B','B','C','C','D','D','D','E','E','E','E','E','E','E','E','E','E','E','E','F','F','G','G','G','H','H','I','I','I','I','I','I','I','I','I','J','K','L','L','L','L','M','M','N','N','N','N','N','O','O','O','O','O','O','O','O','P','P','P','Q','R','R','R','R','R','R','S','S','S','S','T','T','T','T','T','T','U','U','U','U','V','V','W','W','X','Y','Y', 'Z', '*', '*'],
    userBag:[],
    opponentBag: [],
    playedTiles:[],
    moves: [],
    placedTiles: [],
    selectedTileIndex: null,
    submitted: false,
    repicked: false,
    userScore: 0,
    newScore:0
  }

  componentDidMount(){
    this.getMoves()
    this.getUserScore()
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

  getMoves = () =>{
    fetch('http://localhost:3001/moves')
    .then(res => res.json())
    .then(moves =>{
        // console.log(moves)
        let thisGame = moves.filter(move => this.props.game.id === move.game.id)
        this.gameMoves(thisGame)
    })
  }

  gameMoves = (moves) =>{
    // console.log(moves)
    this.removePlayedTiles(moves)
    this.placeTiles(moves)
    this.playerTurn()
    this.setState({
        ...this.state,
        moves: moves
    })
  }

  placeTiles = (moves) =>{
    let i =6
    let playedTiles = moves.map(move => {
        i ++
        return [move.x, move.y, move.letter, i]
    })
    // console.log(placedTiles)
    let rack = this.setRack()
    // console.log(rack)
    let placedTiles = rack.concat(playedTiles)
    this.setState({
        ...this.state,
        placedTiles: placedTiles
    })
}

    setRack = () =>{
        let index = 0
        let rack = this.state.userBag.map(letter =>{
            index ++ 
            return [index, 17, letter, index-1]
        })
        return rack
    }

  removePlayedTiles = (moves) =>{
    let playedTiles = moves.map(move =>{
        return move.letter
    })

    playedTiles.map(letter =>{
        let unusedTiles = this.state.unusedTiles
        let pTiles = this.state.playedTiles
        let pTile
        const index = unusedTiles.indexOf(letter)
        if (index > -1) {
            pTile = unusedTiles.splice(index, 1)[0]
        }
        pTiles.push(pTile)
        this.setState({
            ...this.state,
            unusedTiles: unusedTiles,
            playedTiles: pTiles,
        })
    })
    this.getPlayerTiles()
  }

  getPlayerTiles = () =>{
    // console.log(this.props.game.user1_bag)
    let user1_bag
    let user2_bag
    if(this.props.game.user1_id === this.props.userId){
        user1_bag = this.props.game.user1_bag.split('_')
        user2_bag = this.props.game.user2_bag.split('_')
    }else{
        user1_bag = this.props.game.user2_bag.split('_')
        user2_bag = this.props.game.user1_bag.split('_')
    }
    // console.log(user1_bag)
    user1_bag.map(letter =>{
        let letterUp = letter.toUpperCase()
        let unusedTiles = this.state.unusedTiles
        let myTiles1 = this.state.userBag
        let myTile1
        const index = unusedTiles.indexOf(letterUp)
        if (index > -1) {
            myTile1 = unusedTiles.splice(index, 1)[0]
        }
        myTiles1.push(myTile1)
        this.setState({
            ...this.state,
            unusedTiles: unusedTiles,
            userBag: myTiles1,
        })
    })

    user2_bag.map(letter =>{
        let letterUp = letter.toUpperCase()
        let unusedTiles = this.state.unusedTiles
        let myTiles2 = this.state.opponentBag
        let myTile2
        const index = unusedTiles.indexOf(letterUp)
        if (index > -1) {
            myTile2 = unusedTiles.splice(index, 1)[0]
        }
        myTiles2.push(myTile2)
        this.setState({
            ...this.state,
            unusedTiles: unusedTiles,
            opponentBag: myTiles2,
        })
    })
  }

  playerTurn = () => {
      let playerState
      if(this.props.game.player1turn === true && this.props.game.user1_id === this.props.userId){
            playerState = false
      }else if(this.props.game.player1turn === false && this.props.game.user2_id === this.props.userId){
            playerState = false
      }else{
            playerState = true
      }
      this.setState({
        ...this.state,
        submitted: playerState
    })
  } 

  getUserScore = () =>{
        let score
        if(this.props.game.player1turn === true){
            score = Number(this.props.game.user1_score)
        }else{
            score = Number(this.props.game.user2_score)
        }
        this.setState({
            ...this.state,
            userScore: score
        })
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

  movePiece = (toX, toY) => {
    if(this.state.selectedTileIndex<7){
        let placedTiles = this.state.placedTiles
        placedTiles[this.state.selectedTileIndex] = [toX, toY, this.state.userBag[this.state.selectedTileIndex], this.state.selectedTileIndex]
        // console.log(placedTiles)

        this.setState({
            ...this.state,
            placedTiles: placedTiles
        })
    }
}

    selectTile = (props) =>{
        // console.log(props)
        this.setState({
            ...this.state,
            selectedTileIndex: props
        })
    }

    resetTiles = () =>{
        let resetTiles = this.state.placedTiles
        for(let i = 0; i < 7; i++){
            resetTiles[i] = [i+1, 17, resetTiles[i][2], resetTiles[i][3]]
        }
        this.setState({
            ...this.state,
            placedTiles: resetTiles
        })
    }

    handleClear = () => {
        const tiles =['A','A','A','A','A','A','A','A','A','B','B','C','C','D','D','D','E','E','E','E','E','E','E','E','E','E','E','E','F','F','G','G','G','H','H','I','I','I','I','I','I','I','I','I','J','K','L','L','L','L','M','M','N','N','N','N','N','O','O','O','O','O','O','O','O','P','P','P','Q','R','R','R','R','R','R','S','S','S','S','T','T','T','T','T','T','U','U','U','U','V','V','W','W','X','Y','Y', 'Z', '*', '*']
        this.setState({
            ...this.state,
            unusedTiles: tiles
        })
    }

    handleSubmitClick = () => {
        // console.log('click')
        this.gatherMoves()
        this.setState({
            ...this.state,
            submitted: true
        })
    }

    gatherMoves = () =>{
        let movesMade = []
        let scores = []
        for( let i =0; i < 7; i++){
            if(this.state.placedTiles[i][1] < 15){
                let moveItem = {letter: this.state.placedTiles[i][2], x: this.state.placedTiles[i][0], y: this.state.placedTiles[i][1], game_id: this.props.game.id}
                this.submitMoves(moveItem)
                this.pickTile(i)
                let point = this.getPointValue(this.state.placedTiles[i][2])
                scores.push(point)
            }
        }
        let newScore = this.level1Scoring()
        this.updateGame(newScore)
    }

    submitMoves = (move) =>{
        fetch('http://localhost:3001/moves',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(move)
        })
        .then(res => res.json())
        .then(move =>{
        })
    }

    pickTile = (index) =>{
        let unusedTiles = this.state.unusedTiles
        let randIndex = Math.floor(Math.random() * this.state.unusedTiles.length)
        let drawnTile = unusedTiles.splice(randIndex, 1)[0]
        let userBag = this.state.userBag
        userBag[index] = drawnTile
        this.setState({
            ...this.state,
            userBag: userBag
        })
    }

    repickTiles = () =>{
        for(let i = 0; i < 7; i++){
            this.pickTile(i)
        }
    }

    getPatchData = (user_bag, newScore) =>{
        let patchData
        if(this.props.game.user1_id === this.props.userId){
            patchData = {
                user1_bag: user_bag,
                user1_score: newScore,
                player1turn: false,
                accepted: true 
            }
        }else{
            patchData = {
                user2_bag: user_bag,
                user2_score: newScore,
                player1turn: true,
                accepted: true   
            } 
        }
        console.log(patchData)
        return patchData
    }

    updateGame = (newScore) =>{
        let user_bag = this.state.userBag.join('_')
        let patchData = this.getPatchData(user_bag, newScore)
        // console.log(patchData)
        fetch(`http://localhost:3001/games/${this.props.game.id}`,{
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(patchData)
        })
        .then(res=> res.json())
    }

    getPointValue = (letter) =>{
        let point
        if(letter === 'E' || letter === 'A'|| letter === 'I' || letter === 'O' || letter === 'N' || letter === 'R' || letter === 'T' || letter === 'L'|| letter === 'S'|| letter === 'U'){
            point = 1
        }else if(letter === 'D' || letter === 'G'){
            point = 2
        }else if(letter === 'B' || letter === 'C' || letter === 'M' || letter === 'P'){
            point = 3
        }else if(letter === 'F' || letter === 'H' || letter === 'V' || letter === 'W' || letter === 'Y'){
            point = 4
        }else if(letter === 'K'){
            point = 5
        }else if(letter === 'J' || letter === 'X'){
            point = 8
        }else if(letter === 'Q' || letter === 'Z'){
            point = 10
        }else{
            point = 0
        }
        return point
    }

    level1Scoring = () =>{
        let scores = []
        for( let i =0; i < 7; i++){
            if(this.state.placedTiles[i][1] < 15){
                let moveItem = {letter: this.state.placedTiles[i][2], x: this.state.placedTiles[i][0], y: this.state.placedTiles[i][1], game_id: this.props.game.id}
                let point = this.getPointValue(this.state.placedTiles[i][2])
                scores.push(point)
            }
        }
        // console.log(scores)
        let tt = scores.reduce((a,b) => a + b)
        // console.log(tt)
        // this.props.updateScore(tt)
         let newScore = this.state.userScore + tt
        //  this.props.updateScore(newScore)
        console.log(newScore)
        //  this.setState({
        //     ...this.state,
        //     newScore: newScore}, () =>{
        //     console.log('what')
        // })
        // this.setScore(newScore)
        return newScore
    }

    setScore = (newScore) =>{
        this.setState({
            ...this.state,
            newScore: newScore})
    }    

  render(){
    return (
        <div>
            <div className='background'></div>
            <div className='crab1'></div>
            <div>
                <Board game={this.props.game} userBag={this.state.userBag} placedTiles={this.state.placedTiles} 
                            movePiece={this.movePiece} selectTile={this.selectTile}/>
                <div className="scoreboard">
                    <div className="form" style={{marginTop:'10px', maxWidth:'100%', height:'560px', textAlign: 'left', padding: '35px'}}>
                        <h1 style={{fontSize: '40px'}}> Your Score: </h1> 
                        {this.renderUserScore()}
                        <br/>
                        <h1 style={{fontSize: '40px'}}> {`${this.props.opponentName}'s Score: `}</h1>  
                        {this.renderOpponentScore()}
                        <br/>
                        <button style={{marginTop:'50px'}}>Forfeit Game</button><br/><p/>
                        <Link to='/user'><button style={{marginTop:'10px'}} onClick={() => this.handleClear()}>Go Back To User Page</button></Link>

                    </div>
                </div>
                <div className="play-panel">
                    <div className="form" style={{marginTop:'0px',maxWidth:'100%', height:'72px', textAlign: 'left', padding: '20px'}}>
                        <button onClick={() => this.resetTiles() } disabled={this.state.submitted}>Reset</button>
                        <button onClick={() => this.repickTiles() }style={{marginRight: '30px'}} disabled={this.state.submitted}>Repick</button>
                        <button disabled={this.state.submitted}>Pass</button>
                        <button style={{marginRight: '0px'}} disabled={this.state.submitted} onClick={() => this.handleSubmitClick()}>Submit</button>
                    </div>
                </div>
            </div>            
        </div>
    )
  }
}

export default withRouter(Game);