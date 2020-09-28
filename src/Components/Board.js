import React from 'react';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import Square from './Square';

import LetterTile from './LetterTile'
import BoardSquare from './BoardSquare';



class Board extends React.Component {

    state ={
         xy: [0,0]

    }

    renderSquares = () =>{
        const squares =[]
        for (let i = 0; i < 270; i++) {
            squares.push(this.renderSquare(i, this.state.xy))
        }
        return squares
    }

    renderSquare = (i, tilePosition) => {
        const x = i % 15
        const y = Math.floor(i / 15)
        const isTileHere = x === tilePosition[0] && y === tilePosition[1]
        const piece = isTileHere ? <LetterTile /> : null
        return (
            <div key={i} style={{ width: '6.666667%', height: '5.555556%' }} 
                    >
            <BoardSquare x={x} y={y} movePiece={this.movePiece}>{this.renderTile(x, y, tilePosition)}</BoardSquare>
          </div>
        )
      }

    renderTile = (x, y, [tileX, tileY])  => {
        if (x === tileX && y === tileY) {
          return <LetterTile />
        }
      }

    handleSquareClick = (toX, toY) =>{
        this.movePiece(toX, toY)
    }

    movePiece = (toX, toY) => {
        this.setState({
            ...this.state,
            xy: [toX,toY]
        })
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