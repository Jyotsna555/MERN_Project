import React from 'react';
import {Route} from "react-router-dom";

import Signup from "./Signup";
import Login from "./Login";
import Home from "./Home";
import Welcome from './Welcome';
import Headlines from './Headlines';
import Pinned from './Pinned';
import Logout from './Logout';



function App(){
    return (
        <div>
            <Route exact path="/">
              <Home/>
            </Route>

            <Route  path="/page/signup">
              <Signup/>
            </Route>

            <Route  path="/page/login">
              <Login/>
            </Route>

            <Route  path="/page/welcome">
              <Welcome/>
            </Route>

            <Route  path="/page/headlines">
              <Headlines/>
            </Route>

            <Route  path="/page/logout">
              <Logout/>
            </Route>

            <Route  path="/page/pinned">
              <Pinned/>
            </Route>
        </div>
        
    );
}
export default App;