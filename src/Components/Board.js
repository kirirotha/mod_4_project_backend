import React from 'react';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import LetterTile from './LetterTile'
import BoardSquare from './BoardSquare';



class Board extends React.Component {

    renderSquares = () =>{
        const squares =[]
        for (let i = 0; i < 270; i++) {
            squares.push(this.renderSquare(i))

        }
        return squares
    }

    renderSquare = (i) => {
        const x = i % 15
        const y = Math.floor(i / 15)
        let tile = this.tileCheck(x,y)
        let tileColor = this.bonusCheck(x,y,i)
        return (
            <div key={i} style={{ width: '6.666667%', height: '5.555556%' }}>
                <BoardSquare x={x} y={y} letter={tile[2]} color={tileColor} tileIndex= {tile[3]} movePiece={this.props.movePiece}>
                    {this.renderTile(x, y, tile)}</BoardSquare>
            </div>
        )
    }

    tileCheck = (x,y) =>{
        let thisTile = this.props.placedTiles.filter(tile => ((x === tile[0]) && (y === tile[1])))
        return thisTile.flat()
    }

    bonusCheck = (x,y,i) =>{
        
        if((x === 0 && (y === 0 || y === 7 || y === 14) || (x === 7 && (y === 0 || y === 14)) || (x === 14 && (y === 0 || y === 7 || y === 14)))){
            return '#DC143C'
        }else if(i === 3 || i === 11 || i === 36 || i === 38 || i === 45 || i === 52 || i === 59 || i === 92 || i === 96 || i === 98 | i === 102
            || i === 108 || i === 116 || i === 122 || i === 126 || i === 128 ||  i === 132 || i === 165 || i === 172 || i === 179 || i === 186
            || i === 188 || i === 213 || i === 221){
            return '#87CEFA'
        }else if( i === 16 || i === 28 || i === 32 || i === 42 || i === 48 || i === 56 || i === 64 || i === 70
            || i === 112 || i === 154 || i === 160 || i === 168 || i === 176 || i === 182 || i === 192 || i === 196 || i === 208){
            return '#FFB6C1'
        }else if( i === 20 || i === 24 || i === 76 || i === 80 || i === 84 || i === 88 || i === 136 || i === 140 
            ||i === 144 || i === 148 || i === 200 || i === 204){
            return '#4682B4'
        }else{
            return 'none'
        }
    }

    renderTile = (x, y, tile)  => {
        let point = this.getPoints(tile[2])
        if(x === tile[0] && y === tile[1]){
            return <LetterTile letter={tile[2]} point={point} index={tile[3]} handleSquareClick={this.handleSquareClick}/>
        }
    }

    getPoints = (letter) =>{
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

    handleSquareClick = (props) =>{
        this.props.selectTile(props)
    }

    render(){
    return (
        <DndProvider backend={HTML5Backend}>
            <div className="play-area">
                <div className="game-board-bkgnd"></div>
                <div className="game-board">
                    <div style={{width: '100%',height: '100%',display: 'flex',flexWrap: 'wrap'}}>
                        {this.renderSquares()}     
                    </div> 
                </div>
            </div>
        </DndProvider>
    )
    }
}
export default Board;