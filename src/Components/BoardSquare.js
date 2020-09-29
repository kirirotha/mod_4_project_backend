import React from 'react'
import Square from './Square';
import { Tiles } from './Constants';
import { useDrop } from 'react-dnd'



const BoardSquare = ({ x, y, letter, tileIndex, movePiece, children })  => {
    const [{ isOver }, drop] = useDrop({
      accept: Tiles.ID1,
      drop: () => {
            movePiece(x, y)
            
        },
      collect: monitor => ({
        isOver: !!monitor.isOver(),
      }),
    })
  
    return (
      <div
        ref={drop}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        <Square x={x} y={y}>{children}</Square>
        {isOver && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: '100%',
              zIndex: 1,
              opacity: 0.5,
              backgroundColor: 'yellow',
            }}
          />
        )}
      </div>
    )
  }
  export default BoardSquare;
  