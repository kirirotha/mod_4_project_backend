import React from 'react';
import { Tiles } from './Constants';
import { useDrag } from 'react-dnd'


export default function LetterTile(letter){
    const [{isDragging}, drag] = useDrag({
        item: { type: Tiles.ID1 },
        collect: monitor => ({
          isDragging: !!monitor.isDragging(),
        }),
      })

    return(
        <div className="letter-tile" ref={drag} style={{ fontSize: 25, 
                        fontWeight: 'bold' }}>
            <h2>T</h2>
        </div>
    )
}

