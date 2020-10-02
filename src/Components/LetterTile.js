import React from 'react';
import { Tiles } from './Constants';
import { useDrag } from 'react-dnd'


export default function LetterTile(props){
    const [{isDragging}, drag] = useDrag({
        item: { type: Tiles.ID1 },
        collect: monitor => ({
          isDragging: !!monitor.isDragging(),
        }),
      })

    return(
        <>
            <div className="letter-tile" ref={drag} style={{ fontSize: 25, fontWeight: 'bold' }} onMouseDown={()=>props.handleSquareClick(props.index)}>
                <h2>{props.letter}</h2>
                <div className='point'>
                    <p>{props.point}</p>
                </div>
            </div>
            
        </>
    )
}

