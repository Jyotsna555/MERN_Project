import React from 'react';
import {NavLink} from "react-router-dom";

// console.log((window).height());
// console.log((window).width());

function Nav1(){

  const [colour, setColour]= React.useState({
    home:"black",
    signup:"black",
    login:"black"
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
        <nav className="navbar navbar-expand-lg navbar-light bg-danger navbar-position-custom">
              
           <p className="navbar-nav navbar-brand-custom">MERN PROJECT</p>



      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div className="navbar-nav ml-auto navbar-custom">

        <NavLink onMouseOver={makeWhite} onMouseOut={makeBlack} style={{color:colour.home}} id="home" className="nav-item nav-link" to="/">Home </NavLink>
        <NavLink onMouseOver={makeWhite} onMouseOut={makeBlack} style={{color:colour.signup}} id="signup" className="nav-item nav-link" to="/page/signup">Sign Up</NavLink>
        <NavLink onMouseOver={makeWhite} onMouseOut={makeBlack} style={{color:colour.login}} id="login" className="nav-item nav-link" to="/page/login">Login</NavLink>

    </div>
  </div>
</nav>
        </div>
    )
}
export default Nav1;