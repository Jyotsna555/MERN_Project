import React from 'react';
import {NavLink, useHistory} from "react-router-dom";
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';

function Nav2(){

  const [colour, setColour]= React.useState({
    home:"black",
    headlines:"black",
    pinned:"black",
    logout:"black"
  });


  function makeWhite(event){
    const name = event.target.id;

    setColour(prev => {
      return {
          ...prev, [name]:"white"
      }
    });
  }
  function makeBlack(event){
    const name = event.target.id;

    setColour(prev => {
      return {
          ...prev, [name]:"black"
      }
    });
  }
    return (
        <div className="header sticky-top">
          <nav id="navbar_top" className="navbar navbar-expand-lg navbar-light bg-danger navbar-position-custom">
      
      <p className="navbar-nav navbar-brand-custom">MERN PROJECT</p>



      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>


      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div className="navbar-nav ml-auto navbar-custom">

        <PermIdentityIcon className="loggedIn" />
      
        <NavLink onMouseOver={makeWhite} onMouseOut={makeBlack} style={{color:colour.home}} id="home" className="nav-item nav-link" to="/page/welcome">Home</NavLink>
        <NavLink onMouseOver={makeWhite} onMouseOut={makeBlack} style={{color:colour.headlines}} id="headlines" className="nav-item nav-link" to="/page/headlines">Headlines</NavLink>
        <NavLink onMouseOver={makeWhite} onMouseOut={makeBlack} style={{color:colour.pinned}} id="pinned" className="nav-item nav-link" to="/page/pinned">Pinned</NavLink>
        <NavLink onMouseOver={makeWhite} onMouseOut={makeBlack} style={{color:colour.logout}} id="logout" className="nav-item nav-link navContent"to="/page/logout">Log Out</NavLink>
    
      

       </div>
      </div>
    </nav>


      </div>
    )
}
export default Nav2;