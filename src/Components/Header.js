import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = (props) => {

  return (
    <div className='navbar'>
      <div className='header'><h1>Crabble Yo!</h1> </div>
      <ul>
        <NavLink to="/"> Home </NavLink>
        <NavLink to="/login"> Login </NavLink>
        <NavLink to="/signup"> Signup </NavLink>
        <NavLink to="/user"> User </NavLink>
        <NavLink to="/game"> Game </NavLink>
      </ul>
    </div>
  )
}

export default Header;