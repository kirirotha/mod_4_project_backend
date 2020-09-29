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
        return (
            <div key={i} style={{ width: '6.666667%', height: '5.555556%' }}>
                <BoardSquare x={x} y={y} letter={tile[2]} tileIndex= {tile[3]} movePiece={this.props.movePiece}>
                    {this.renderTile(x, y, tile)}</BoardSquare>
            </div>
        )
    }

    tileCheck = (x,y) =>{
        let thisTile = this.props.placedTiles.filter(tile => ((x === tile[0]) && (y === tile[1])))
        return thisTile.flat()
    }

    renderTile = (x, y, tile)  => {
        if(x === tile[0] && y === tile[1]){
            return <LetterTile letter={tile[2]} index={tile[3]} handleSquareClick={this.handleSquareClick}/>
        }
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