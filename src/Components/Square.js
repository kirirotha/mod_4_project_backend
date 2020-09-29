import React from 'react';

const Square = (props) =>{
    if(props.y === 15 || props.y ===16 || (props.y ===17 && props.x < 1) || (props.y === 17 && props.x > 7)){
        return(
            <div className="square" style={{border: 'none'}}>
                {props.children}
            </div>
        )
    }else{
        return(
        <div className="square">
            {props.children}
        </div>
         )
    }
}

export default Square;